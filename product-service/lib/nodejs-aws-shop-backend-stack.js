"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodejsAwsShopBackendStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const dotenv = __importStar(require("dotenv"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const nodejs = __importStar(require("aws-cdk-lib/aws-lambda-nodejs"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const aws_sns_subscriptions_1 = require("aws-cdk-lib/aws-sns-subscriptions");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
const path = __importStar(require("path"));
dotenv.config({ path: "../.env" });
class NodejsAwsShopBackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const IMPORT_SERVICE_QUEUE_NAME = process.env.IMPORT_SERVICE_QUEUE_NAME;
        if (!IMPORT_SERVICE_QUEUE_NAME) {
            throw new Error("IMPORT_SERVICE_QUEUE_NAME environment variable is not set");
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
        const catalogItemsQueue = new aws_sqs_1.Queue(this, "CatalogItemsQueue", {
            queueName: IMPORT_SERVICE_QUEUE_NAME,
        });
        const createProductTopic = new aws_sns_1.Topic(this, "CreateProductTopic", {
            topicName: "CreateProductTopic",
        });
        // Add email subscription
        createProductTopic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription("a.milashchenkov@softteco.com", {
            filterPolicy: {
                price: aws_sns_1.SubscriptionFilter.numericFilter({
                    greaterThanOrEqualTo: 500,
                }),
            },
        }));
        createProductTopic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription("encode.cpp@gmail.com", {
            filterPolicy: {
                price: aws_sns_1.SubscriptionFilter.numericFilter({
                    lessThanOrEqualTo: 500,
                }),
            },
        }));
        const catalogBatchProcess = new nodejs.NodejsFunction(this, "CatalogBatchProcess", {
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
        });
        createProductTopic.grantPublish(catalogBatchProcess);
        catalogBatchProcess.addEventSource(new aws_lambda_event_sources_1.SqsEventSource(catalogItemsQueue, {
            batchSize: 5,
        }));
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
        const getProductsListFunction = new nodejs.NodejsFunction(this, "getProductsList", {
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
        });
        const getProductsByIdFunction = new nodejs.NodejsFunction(this, "getProductsById", {
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
        });
        const createProductFunction = new nodejs.NodejsFunction(this, "createProduct", {
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
        });
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
        products.addMethod("GET", new apigateway.LambdaIntegration(getProductsListFunction, {
            proxy: true,
            requestTemplates: {
                "application/json": '{ "statusCode": "200" }',
            },
        }));
        products.addMethod("POST", new apigateway.LambdaIntegration(createProductFunction, {
            proxy: true,
        }));
        const product = products.addResource("{id}");
        product.addMethod("GET", new apigateway.LambdaIntegration(new nodejs.NodejsFunction(this, "getProductsByIdGet", {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            entry: path.join(__dirname, "../lambda/getProductsById/index.ts"),
        }), {
            proxy: true,
        }));
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
exports.NodejsAwsShopBackendStack = NodejsAwsShopBackendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWF3cy1zaG9wLWJhY2tlbmQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtYXdzLXNob3AtYmFja2VuZC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUNuQywrQ0FBaUM7QUFDakMsK0RBQWlEO0FBQ2pELHNFQUF3RDtBQUN4RCx1RUFBeUQ7QUFDekQsbUVBQXFEO0FBQ3JELGlEQUFnRTtBQUNoRSxpREFBNEM7QUFDNUMsNkVBQXNFO0FBQ3RFLG1GQUFzRTtBQUV0RSwyQ0FBNkI7QUFFN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBSW5DLE1BQWEseUJBQTBCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7UUFFeEUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FDYiwyREFBMkQsQ0FDNUQsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUM5RCxTQUFTLEVBQUUsVUFBVTtZQUNyQixZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNqRSxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsc0NBQXNDO1lBQ2hGLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVc7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QVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRztZQUNkLFdBQVcsRUFBRSxpQkFBaUI7U0FDL0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBL05ELDhEQStOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIG5vZGVqcyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanNcIjtcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5XCI7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgeyBUb3BpYywgU3Vic2NyaXB0aW9uRmlsdGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zbnNcIjtcbmltcG9ydCB7IFF1ZXVlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zcXNcIjtcbmltcG9ydCB7IEVtYWlsU3Vic2NyaXB0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zbnMtc3Vic2NyaXB0aW9uc1wiO1xuaW1wb3J0IHsgU3FzRXZlbnRTb3VyY2UgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ldmVudC1zb3VyY2VzXCI7XG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuZG90ZW52LmNvbmZpZyh7IHBhdGg6IFwiLi4vLmVudlwiIH0pO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuXG5leHBvcnQgY2xhc3MgTm9kZWpzQXdzU2hvcEJhY2tlbmRTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IElNUE9SVF9TRVJWSUNFX1FVRVVFX05BTUUgPSBwcm9jZXNzLmVudi5JTVBPUlRfU0VSVklDRV9RVUVVRV9OQU1FO1xuXG4gICAgaWYgKCFJTVBPUlRfU0VSVklDRV9RVUVVRV9OQU1FKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiSU1QT1JUX1NFUlZJQ0VfUVVFVUVfTkFNRSBlbnZpcm9ubWVudCB2YXJpYWJsZSBpcyBub3Qgc2V0XCIsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHByb2R1Y3RzVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgXCJQcm9kdWN0c1RhYmxlXCIsIHtcbiAgICAgIHRhYmxlTmFtZTogXCJwcm9kdWN0c1wiLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwiaWRcIiwgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIENoYW5nZWQgdG8gREVTVFJPWSBmb3IgZWFzeSBjbGVhbnVwXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUFJPVklTSU9ORUQsXG4gICAgICByZWFkQ2FwYWNpdHk6IDEsIC8vIE1pbmltdW0gcG9zc2libGUgdmFsdWVcbiAgICAgIHdyaXRlQ2FwYWNpdHk6IDEsIC8vIE1pbmltdW0gcG9zc2libGUgdmFsdWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0b2Nrc1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsIFwiU3RvY2tzVGFibGVcIiwge1xuICAgICAgdGFibGVOYW1lOiBcInN0b2Nrc1wiLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwicHJvZHVjdF9pZFwiLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgIHJlYWRDYXBhY2l0eTogMSxcbiAgICAgIHdyaXRlQ2FwYWNpdHk6IDEsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjYXRhbG9nSXRlbXNRdWV1ZSA9IG5ldyBRdWV1ZSh0aGlzLCBcIkNhdGFsb2dJdGVtc1F1ZXVlXCIsIHtcbiAgICAgIHF1ZXVlTmFtZTogSU1QT1JUX1NFUlZJQ0VfUVVFVUVfTkFNRSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZVByb2R1Y3RUb3BpYyA9IG5ldyBUb3BpYyh0aGlzLCBcIkNyZWF0ZVByb2R1Y3RUb3BpY1wiLCB7XG4gICAgICB0b3BpY05hbWU6IFwiQ3JlYXRlUHJvZHVjdFRvcGljXCIsXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgZW1haWwgc3Vic2NyaXB0aW9uXG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmFkZFN1YnNjcmlwdGlvbihcbiAgICAgIG5ldyBFbWFpbFN1YnNjcmlwdGlvbihcImEubWlsYXNoY2hlbmtvdkBzb2Z0dGVjby5jb21cIiwge1xuICAgICAgICBmaWx0ZXJQb2xpY3k6IHtcbiAgICAgICAgICBwcmljZTogU3Vic2NyaXB0aW9uRmlsdGVyLm51bWVyaWNGaWx0ZXIoe1xuICAgICAgICAgICAgZ3JlYXRlclRoYW5PckVxdWFsVG86IDUwMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmFkZFN1YnNjcmlwdGlvbihcbiAgICAgIG5ldyBFbWFpbFN1YnNjcmlwdGlvbihcImVuY29kZS5jcHBAZ21haWwuY29tXCIsIHtcbiAgICAgICAgZmlsdGVyUG9saWN5OiB7XG4gICAgICAgICAgcHJpY2U6IFN1YnNjcmlwdGlvbkZpbHRlci5udW1lcmljRmlsdGVyKHtcbiAgICAgICAgICAgIGxlc3NUaGFuT3JFcXVhbFRvOiA1MDAsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgY29uc3QgY2F0YWxvZ0JhdGNoUHJvY2VzcyA9IG5ldyBub2RlanMuTm9kZWpzRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJDYXRhbG9nQmF0Y2hQcm9jZXNzXCIsXG4gICAgICB7XG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2NhdGFsb2dCYXRjaFByb2Nlc3MvaW5kZXgudHNcIiksXG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXSxcbiAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgc291cmNlTWFwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBTTlNfVE9QSUNfQVJOOiBjcmVhdGVQcm9kdWN0VG9waWMudG9waWNBcm4sXG4gICAgICAgICAgUFJPRFVDVFNfVEFCTEU6IHByb2R1Y3RzVGFibGUudGFibGVOYW1lLFxuICAgICAgICAgIFNUT0NLU19UQUJMRTogc3RvY2tzVGFibGUudGFibGVOYW1lLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmdyYW50UHVibGlzaChjYXRhbG9nQmF0Y2hQcm9jZXNzKTtcblxuICAgIGNhdGFsb2dCYXRjaFByb2Nlc3MuYWRkRXZlbnRTb3VyY2UoXG4gICAgICBuZXcgU3FzRXZlbnRTb3VyY2UoY2F0YWxvZ0l0ZW1zUXVldWUsIHtcbiAgICAgICAgYmF0Y2hTaXplOiA1LFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgXCJOb2RlanNBd3NTaG9wQXBpXCIsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiBcIlNob3AgU2VydmljZVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGhpcyBpcyB0aGUgU2hvcCBBUElcIixcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXG4gICAgICAgIGFsbG93SGVhZGVyczogYXBpZ2F0ZXdheS5Db3JzLkRFRkFVTFRfSEVBREVSUyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBMYW1iZGEgZnVuY3Rpb25zXG4gICAgY29uc3QgZ2V0UHJvZHVjdHNMaXN0RnVuY3Rpb24gPSBuZXcgbm9kZWpzLk5vZGVqc0Z1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiZ2V0UHJvZHVjdHNMaXN0XCIsXG4gICAgICB7XG4gICAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgICAgZXh0ZXJuYWxNb2R1bGVzOiBbXSxcbiAgICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgICAgc291cmNlTWFwOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9sYW1iZGEvZ2V0UHJvZHVjdHNMaXN0L2luZGV4LnRzXCIpLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFBST0RVQ1RTX1RBQkxFOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICBTVE9DS1NfVEFCTEU6IHN0b2Nrc1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICBSRUdJT046IGNkay5TdGFjay5vZih0aGlzKS5yZWdpb24sXG4gICAgICAgICAgUE9XRVJUT09MU19TRVJWSUNFX05BTUU6IFwicHJvZHVjdFNlcnZpY2VcIixcbiAgICAgICAgICBQT1dFUlRPT0xTX01FVFJJQ1NfTkFNRVNQQUNFOiBcIlByb2R1Y3RzQXBwXCIsXG4gICAgICAgICAgTE9HX0xFVkVMOiBcIklORk9cIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IGdldFByb2R1Y3RzQnlJZEZ1bmN0aW9uID0gbmV3IG5vZGVqcy5Ob2RlanNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImdldFByb2R1Y3RzQnlJZFwiLFxuICAgICAge1xuICAgICAgICBidW5kbGluZzoge1xuICAgICAgICAgIGV4dGVybmFsTW9kdWxlczogW10sXG4gICAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICAgIHNvdXJjZU1hcDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2dldFByb2R1Y3RzQnlJZC9pbmRleC50c1wiKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBQUk9EVUNUU19UQUJMRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgU1RPQ0tTX1RBQkxFOiBzdG9ja3NUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgUkVHSU9OOiBjZGsuU3RhY2sub2YodGhpcykucmVnaW9uLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgY29uc3QgY3JlYXRlUHJvZHVjdEZ1bmN0aW9uID0gbmV3IG5vZGVqcy5Ob2RlanNGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBcImNyZWF0ZVByb2R1Y3RcIixcbiAgICAgIHtcbiAgICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtdLFxuICAgICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgICBzb3VyY2VNYXA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXG4gICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL2xhbWJkYS9jcmVhdGVQcm9kdWN0L2luZGV4LnRzXCIpLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFBST0RVQ1RTX1RBQkxFOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICBTVE9DS1NfVEFCTEU6IHN0b2Nrc1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICBSRUdJT046IGNkay5TdGFjay5vZih0aGlzKS5yZWdpb24sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICk7XG5cbiAgICAvLyBHcmFudCBwZXJtaXNzaW9ucyB0byBMYW1iZGFcbiAgICBwcm9kdWN0c1RhYmxlLmdyYW50UmVhZERhdGEoZ2V0UHJvZHVjdHNMaXN0RnVuY3Rpb24pO1xuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRSZWFkRGF0YShnZXRQcm9kdWN0c0J5SWRGdW5jdGlvbik7XG4gICAgcHJvZHVjdHNUYWJsZS5ncmFudFdyaXRlRGF0YShjcmVhdGVQcm9kdWN0RnVuY3Rpb24pO1xuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRXcml0ZURhdGEoY2F0YWxvZ0JhdGNoUHJvY2Vzcyk7XG5cbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWREYXRhKGdldFByb2R1Y3RzTGlzdEZ1bmN0aW9uKTtcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWREYXRhKGdldFByb2R1Y3RzQnlJZEZ1bmN0aW9uKTtcbiAgICBzdG9ja3NUYWJsZS5ncmFudFdyaXRlRGF0YShjcmVhdGVQcm9kdWN0RnVuY3Rpb24pO1xuICAgIHN0b2Nrc1RhYmxlLmdyYW50V3JpdGVEYXRhKGNhdGFsb2dCYXRjaFByb2Nlc3MpO1xuXG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmdyYW50UHVibGlzaChjYXRhbG9nQmF0Y2hQcm9jZXNzKTtcbiAgICBjYXRhbG9nSXRlbXNRdWV1ZS5ncmFudENvbnN1bWVNZXNzYWdlcyhjYXRhbG9nQmF0Y2hQcm9jZXNzKTtcblxuICAgIGNvbnN0IHByb2R1Y3RzID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJwcm9kdWN0c1wiKTtcblxuICAgIHByb2R1Y3RzLmFkZE1ldGhvZChcbiAgICAgIFwiR0VUXCIsXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihnZXRQcm9kdWN0c0xpc3RGdW5jdGlvbiwge1xuICAgICAgICBwcm94eTogdHJ1ZSxcbiAgICAgICAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiAneyBcInN0YXR1c0NvZGVcIjogXCIyMDBcIiB9JyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBwcm9kdWN0cy5hZGRNZXRob2QoXG4gICAgICBcIlBPU1RcIixcbiAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGNyZWF0ZVByb2R1Y3RGdW5jdGlvbiwge1xuICAgICAgICBwcm94eTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHMuYWRkUmVzb3VyY2UoXCJ7aWR9XCIpO1xuXG4gICAgcHJvZHVjdC5hZGRNZXRob2QoXG4gICAgICBcIkdFVFwiLFxuICAgICAgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oXG4gICAgICAgIG5ldyBub2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgXCJnZXRQcm9kdWN0c0J5SWRHZXRcIiwge1xuICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL2xhbWJkYS9nZXRQcm9kdWN0c0J5SWQvaW5kZXgudHNcIiksXG4gICAgICAgIH0pLFxuICAgICAgICB7XG4gICAgICAgICAgcHJveHk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICk7XG5cbiAgICAvLyBBZGQgQVBJIEdhdGV3YXkgcmVzcG9uc2UgKG9wdGlvbmFsKVxuICAgIGFwaS5hZGRHYXRld2F5UmVzcG9uc2UoXCJEZWZhdWx0RXJyb3JcIiwge1xuICAgICAgdHlwZTogYXBpZ2F0ZXdheS5SZXNwb25zZVR5cGUuREVGQVVMVF80WFgsXG4gICAgICByZXNwb25zZUhlYWRlcnM6IHtcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCInKidcIixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXQgdGhlIEFQSSBVUkxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkFwaVVybFwiLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkFQSSBHYXRld2F5IFVSTFwiLFxuICAgIH0pO1xuICB9XG59XG4iXX0=