import * as path from "path";
import * as dotenv from "dotenv";

import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ResponseType } from "aws-cdk-lib/aws-apigateway";

dotenv.config({ path: "../.env" });

const IMPORT_SERVICE_QUEUE_NAME = process.env.IMPORT_SERVICE_QUEUE_NAME;

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizerArn = `arn:aws:lambda:${this.region}:${this.account}:function:basicAuthorizer`;

    // Import the authorizer function using constructed ARN
    const basicAuthorizer = lambda.Function.fromFunctionArn(
      this,
      "BasicAuthorizer",
      basicAuthorizerArn,
    );

    // Create Lambda authorizer
    const authorizer = new apigateway.TokenAuthorizer(
      this,
      "ImportApiAuthorizer",
      {
        handler: basicAuthorizer,
        identitySource: apigateway.IdentitySource.header("Authorization"),
        resultsCacheTtl: cdk.Duration.seconds(0),
      },
    );

    if (!IMPORT_SERVICE_QUEUE_NAME) {
      throw new Error(
        "IMPORT_SERVICE_QUEUE_NAME environment variable is not set",
      );
    }

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

    const catalogItemsQueue = Queue.fromQueueAttributes(
      this,
      "import-service-queue",
      {
        queueName: IMPORT_SERVICE_QUEUE_NAME,
        queueArn: `arn:aws:sqs:${this.region}:${this.account}:${IMPORT_SERVICE_QUEUE_NAME}`,
      },
    );

    const nodejsFunctionDefaultOptions = {
      depsLockFilePath: require.resolve("../package.json"),
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      bundling: {
        minify: true,
        sourceMap: false,
        externalModules: [],
      },
      environment: {
        BUCKET_NAME: csvBucket.bucketName,
      },
    };

    // Create lambda function for importing
    const importProductsFile = new NodejsFunction(
      this,
      "import-products-files",
      {
        handler: "lambda/importProductsFile/index.handler",
        entry: path.join(__dirname, "../lambda/importProductsFile/index.ts"),
        ...nodejsFunctionDefaultOptions,
      },
    );

    // Create lambda function for parsing
    const importFileParser = new NodejsFunction(this, "import-file-parser", {
      entry: path.join(__dirname, "../lambda/importFileParser/index.ts"),
      handler: "lambda/importFileParser/index.handler",
      ...nodejsFunctionDefaultOptions,
      environment: {
        ...nodejsFunctionDefaultOptions.environment,
        SQS_QUEUE_URL: catalogItemsQueue.queueUrl,
      },
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

    // Grant parser permissions to SQS
    catalogItemsQueue.grantSendMessages(importFileParser);

    // Create an event notification when files added to uploaded
    csvBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(importFileParser),
      { prefix: "uploaded/" },
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, "ImportServiceApi", {
      restApiName: "Import Service API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
        ],
      },
    });

    const importResource = api.root.addResource("import");

    const headers = {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'Content-Type,Authorization'",
    };

    api.addGatewayResponse("Unauthorized", {
      type: ResponseType.UNAUTHORIZED,
      statusCode: "401",
      responseHeaders: headers,
      templates: {
        "application/json": '{"message": "Unauthorized", "statusCode": 401}',
      },
    });

    api.addGatewayResponse("MissingAuthenticationToken", {
      type: ResponseType.MISSING_AUTHENTICATION_TOKEN,
      responseHeaders: headers,
      statusCode: "401",
      templates: {
        "application/json":
          '{"message": "Missing authentication token", "statusCode": 401}',
      },
    });

    api.addGatewayResponse("Forbidden", {
      type: apigateway.ResponseType.ACCESS_DENIED,
      statusCode: "403",
      responseHeaders: headers,
      templates: {
        "application/json": '{"message": "Access Denied", "statusCode": 403}',
      },
    });

    importResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(importProductsFile),
      {
        authorizer: authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        requestParameters: {
          "method.request.querystring.name": true,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
            },
          },
          {
            statusCode: "401",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
            },
          },
          {
            statusCode: "403",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
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
