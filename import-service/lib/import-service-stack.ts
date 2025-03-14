import * as path from "path";

import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for storing uploaded CSV files
    const csvBucket = new s3.Bucket(this, "import-service-csv-bucket", {
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ["*"],
        },
      ],
    });

    // Create empty objects to establish the directory structure
    new s3deploy.BucketDeployment(this, "csv-bucket-deployment", {
      sources: [
        s3deploy.Source.data("uploaded/.keep", ""),
        s3deploy.Source.data("parsed/.keep", ""),
      ],
      destinationBucket: csvBucket,
    });

    const nodejsFunctionDefaultOptions = {
      depsLockFilePath: require.resolve("../package.json"),
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: [],
      },
      handler: "handler",
      environment: {
        BUCKET_NAME: csvBucket.bucketName,
      },
    };

    // Create lambda function for importing
    const importProductsFile = new NodejsFunction(
      this,
      "import-products-files",
      {
        entry: path.join(__dirname, "../lambda/importProductsFile/index.ts"),
        ...nodejsFunctionDefaultOptions,
      },
    );

    // Create lambda function for parsing
    const importFileParser = new NodejsFunction(this, "import-file-parser", {
      entry: path.join(__dirname, "../lambda/importFileParser/index.ts"),
      ...nodejsFunctionDefaultOptions,
    });

    // Add explicit S3 permissions
    importProductsFile.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:GetObject"],
        resources: [`${csvBucket.bucketArn}/*`, csvBucket.bucketArn],
      }),
    );

    // Grant S3 permissions to Lambda
    csvBucket.grantReadWrite(importProductsFile);
    csvBucket.grantReadWrite(importFileParser);
    csvBucket.grantDelete(importFileParser);

    // Create an event notification when files added to uploaded
    csvBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(importFileParser),
      { prefix: "uploaded/" },
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, "import-api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Add resource and method
    const importResource = api.root.addResource("import");
    importResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(importProductsFile),
      {
        requestParameters: {
          "method.request.querystring.name": true,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
            },
            responseModels: {
              "application/json": apigateway.Model.EMPTY_MODEL,
            },
          },
          {
            // It's good practice to also define error responses
            statusCode: "400",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
            },
            responseModels: {
              "application/json": apigateway.Model.ERROR_MODEL,
            },
          },
        ],
      },
    );

    // After deploying your stack, you can see the API URL in the CloudFormation console
    new cdk.CfnOutput(this, "api-gateway-url", {
      value: api.url,
      description: "API URL",
    });
  }
}
