import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const LOGIN = process.env.USERNAME || "";
    const PASSWORD = process.env.PASSWORD || "";

    const basicAuthorizerFunction = new NodejsFunction(
      this,
      "BasicAuthorizer",
      {
        functionName: "basicAuthorizer",
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        entry: path.join(__dirname, "../lambda/basicAuthorizer/index.ts"),
        environment: {
          LOGIN,
          PASSWORD,
        },
        bundling: {
          minify: true,
          sourceMap: false,
        },
      },
    );

    new cdk.CfnOutput(this, "ARN", {
      value: basicAuthorizerFunction.functionArn,
      exportName: "BasicAuthorizerLambdaArn",
    });
  }
}
