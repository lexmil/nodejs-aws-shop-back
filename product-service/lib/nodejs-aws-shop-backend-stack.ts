import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Topic, SubscriptionFilter } from "aws-cdk-lib/aws-sns";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

import * as path from "path";

dotenv.config({ path: "../.env" });

import { Construct } from "constructs";

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const IMPORT_SERVICE_QUEUE_NAME = process.env.IMPORT_SERVICE_QUEUE_NAME;

    if (!IMPORT_SERVICE_QUEUE_NAME) {
      throw new Error(
        "IMPORT_SERVICE_QUEUE_NAME environment variable is not set",
      );
    }

    const productsTable = new dynamodb.Table(this, "ProductsTable", {
      tableName: "products",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Changed to DESTROY for easy cleanup
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1, // Minimum possible value
      writeCapacity: 1, // Minimum possible value
    });

    const stocksTable = new dynamodb.Table(this, "StocksTable", {
      tableName: "stocks",
      partitionKey: { name: "product_id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    const catalogItemsQueue = new Queue(this, "CatalogItemsQueue", {
      queueName: IMPORT_SERVICE_QUEUE_NAME,
    });

    const createProductTopic = new Topic(this, "CreateProductTopic", {
      topicName: "createProductTopic",
    });

    // Add email subscription
    createProductTopic.addSubscription(
      new EmailSubscription("a.milashchenkov@softteco.com", {
        filterPolicy: {
          price: SubscriptionFilter.numericFilter({
            greaterThanOrEqualTo: 100,
          }),
        },
      }),
    );
    createProductTopic.addSubscription(
      new EmailSubscription("encode.cpp@gmail.com", {
        filterPolicy: {
          price: SubscriptionFilter.numericFilter({
            lessThanOrEqualTo: 100,
          }),
        },
      }),
    );

    const catalogBatchProcess = new nodejs.NodejsFunction(
      this,
      "CatalogBatchProcess",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        entry: path.join(__dirname, "../lambda/catalogBatchProcess/index.ts"),
        bundling: {
          externalModules: [],
          minify: true,
          sourceMap: false,
        },
        environment: {
          SNS_TOPIC_ARN: createProductTopic.topicArn,
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
        },
      },
    );

    createProductTopic.grantPublish(catalogBatchProcess);

    catalogBatchProcess.addEventSource(
      new SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
      }),
    );

    const api = new apigateway.RestApi(this, "NodejsAwsShopApi", {
      restApiName: "Shop Service",
      description: "This is the Shop API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Lambda functions
    const getProductsListFunction = new nodejs.NodejsFunction(
      this,
      "getProductsList",
      {
        bundling: {
          externalModules: [],
          minify: true,
          sourceMap: false,
        },
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        entry: path.join(__dirname, "../lambda/getProductsList/index.ts"),
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
          REGION: cdk.Stack.of(this).region,
          POWERTOOLS_SERVICE_NAME: "productService",
          POWERTOOLS_METRICS_NAMESPACE: "ProductsApp",
          LOG_LEVEL: "INFO",
        },
      },
    );

    const getProductsByIdFunction = new nodejs.NodejsFunction(
      this,
      "getProductsById",
      {
        bundling: {
          externalModules: [],
          minify: true,
          sourceMap: false,
        },
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        entry: path.join(__dirname, "../lambda/getProductsById/index.ts"),
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
          REGION: cdk.Stack.of(this).region,
        },
      },
    );

    const createProductFunction = new nodejs.NodejsFunction(
      this,
      "createProduct",
      {
        bundling: {
          externalModules: [],
          minify: true,
          sourceMap: false,
        },
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        entry: path.join(__dirname, "../lambda/createProduct/index.ts"),
        environment: {
          PRODUCTS_TABLE: productsTable.tableName,
          STOCKS_TABLE: stocksTable.tableName,
          REGION: cdk.Stack.of(this).region,
        },
      },
    );

    // Grant permissions to Lambda
    productsTable.grantReadData(getProductsListFunction);
    productsTable.grantReadData(getProductsByIdFunction);
    productsTable.grantWriteData(createProductFunction);
    productsTable.grantWriteData(catalogBatchProcess);

    stocksTable.grantReadData(getProductsListFunction);
    stocksTable.grantReadData(getProductsByIdFunction);
    stocksTable.grantWriteData(createProductFunction);
    stocksTable.grantWriteData(catalogBatchProcess);

    createProductTopic.grantPublish(catalogBatchProcess);
    catalogItemsQueue.grantConsumeMessages(catalogBatchProcess);

    const products = api.root.addResource("products");

    products.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getProductsListFunction, {
        proxy: true,
        requestTemplates: {
          "application/json": '{ "statusCode": "200" }',
        },
      }),
    );

    products.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createProductFunction, {
        proxy: true,
      }),
    );

    const product = products.addResource("{id}");

    product.addMethod(
      "GET",
      new apigateway.LambdaIntegration(
        new nodejs.NodejsFunction(this, "getProductsByIdGet", {
          runtime: lambda.Runtime.NODEJS_20_X,
          handler: "index.handler",
          entry: path.join(__dirname, "../lambda/getProductsById/index.ts"),
        }),
        {
          proxy: true,
        },
      ),
    );

    // Add API Gateway response (optional)
    api.addGatewayResponse("DefaultError", {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
      },
    });

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
