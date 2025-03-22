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

    const USERNAME = process.env.USERNAME || "";
    const PASSWORD = process.env.PASSWORD || "";

    new NodejsFunction(this, "BasicAuthorizer", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "lambda/basicAuthorizer/index.handler",
      entry: path.join(__dirname, "../lambda/basicAuthorizer/index.ts"),
      environment: {
        [USERNAME]: PASSWORD,
      },
      bundling: {
        minify: true,
        sourceMap: false,
      },
    });
  }
}
