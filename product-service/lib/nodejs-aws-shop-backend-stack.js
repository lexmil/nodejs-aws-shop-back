"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodejsAwsShopBackendStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const nodejs = require("aws-cdk-lib/aws-lambda-nodejs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const path = require("path");
class NodejsAwsShopBackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const productsTable = new dynamodb.Table(this, 'ProductsTable', {
            tableName: 'products',
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Changed to DESTROY for easy cleanup
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1, // Minimum possible value
            writeCapacity: 1, // Minimum possible value
        });
        const stocksTable = new dynamodb.Table(this, 'StocksTable', {
            tableName: 'stocks',
            partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1,
        });
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
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            entry: path.join(__dirname, "../lambda/getProductsList/index.ts"),
            environment: {
                PRODUCTS_TABLE: productsTable.tableName,
                STOCKS_TABLE: stocksTable.tableName,
                REGION: cdk.Stack.of(this).region,
                POWERTOOLS_SERVICE_NAME: 'productService',
                POWERTOOLS_METRICS_NAMESPACE: 'ProductsApp',
                LOG_LEVEL: 'INFO',
            }
        });
        const getProductsByIdFunction = new nodejs.NodejsFunction(this, "getProductsById", {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            entry: path.join(__dirname, "../lambda/getProductsById/index.ts"),
            environment: {
                PRODUCTS_TABLE: productsTable.tableName,
                STOCKS_TABLE: stocksTable.tableName,
                REGION: cdk.Stack.of(this).region,
            }
        });
        const createProductFunction = new nodejs.NodejsFunction(this, "createProduct", {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            entry: path.join(__dirname, "../lambda/createProduct/index.ts"),
            environment: {
                PRODUCTS_TABLE: productsTable.tableName,
                STOCKS_TABLE: stocksTable.tableName,
                REGION: cdk.Stack.of(this).region,
            }
        });
        // Grant permissions to Lambda
        productsTable.grantReadData(getProductsListFunction);
        productsTable.grantReadData(getProductsByIdFunction);
        productsTable.grantWriteData(createProductFunction);
        stocksTable.grantReadData(getProductsListFunction);
        stocksTable.grantReadData(getProductsByIdFunction);
        stocksTable.grantWriteData(createProductFunction);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWF3cy1zaG9wLWJhY2tlbmQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtYXdzLXNob3AtYmFja2VuZC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBQ2pELHdEQUF3RDtBQUN4RCx5REFBeUQ7QUFDekQscURBQXFEO0FBRXJELDZCQUE2QjtBQUk3QixNQUFhLHlCQUEwQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3RELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDOUQsU0FBUyxFQUFFLFVBQVU7WUFDckIsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDakUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFHLHNDQUFzQztZQUNqRixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzdDLFlBQVksRUFBRSxDQUFDLEVBQUsseUJBQXlCO1lBQzdDLGFBQWEsRUFBRSxDQUFDLEVBQUkseUJBQXlCO1NBQzlDLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzFELFNBQVMsRUFBRSxRQUFRO1lBQ25CLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3pFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87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QUNoQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDZCxXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQS9IRCw4REErSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIG5vZGVqcyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanNcIjtcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5XCI7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcblxuZXhwb3J0IGNsYXNzIE5vZGVqc0F3c1Nob3BCYWNrZW5kU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBwcm9kdWN0c1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdQcm9kdWN0c1RhYmxlJywge1xuICAgICAgdGFibGVOYW1lOiAncHJvZHVjdHMnLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdpZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAgLy8gQ2hhbmdlZCB0byBERVNUUk9ZIGZvciBlYXN5IGNsZWFudXBcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgIHJlYWRDYXBhY2l0eTogMSwgICAgLy8gTWluaW11bSBwb3NzaWJsZSB2YWx1ZVxuICAgICAgd3JpdGVDYXBhY2l0eTogMSwgICAvLyBNaW5pbXVtIHBvc3NpYmxlIHZhbHVlXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdG9ja3NUYWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnU3RvY2tzVGFibGUnLCB7XG4gICAgICB0YWJsZU5hbWU6ICdzdG9ja3MnLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdwcm9kdWN0X2lkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUFJPVklTSU9ORUQsXG4gICAgICByZWFkQ2FwYWNpdHk6IDEsXG4gICAgICB3cml0ZUNhcGFjaXR5OiAxLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCBcIk5vZGVqc0F3c1Nob3BBcGlcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IFwiU2hvcCBTZXJ2aWNlXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGlzIGlzIHRoZSBTaG9wIEFQSVwiLFxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgIGFsbG93T3JpZ2luczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TLFxuICAgICAgICBhbGxvd01ldGhvZHM6IGFwaWdhdGV3YXkuQ29ycy5BTExfTUVUSE9EUyxcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBhcGlnYXRld2F5LkNvcnMuREVGQVVMVF9IRUFERVJTLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIExhbWJkYSBmdW5jdGlvbnNcbiAgICBjb25zdCBnZXRQcm9kdWN0c0xpc3RGdW5jdGlvbiA9IG5ldyBub2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgXCJnZXRQcm9kdWN0c0xpc3RcIiwge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL2xhbWJkYS9nZXRQcm9kdWN0c0xpc3QvaW5kZXgudHNcIiksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBQUk9EVUNUU19UQUJMRTogcHJvZHVjdHNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFNUT0NLU19UQUJMRTogc3RvY2tzVGFibGUudGFibGVOYW1lLFxuICAgICAgICBSRUdJT046IGNkay5TdGFjay5vZih0aGlzKS5yZWdpb24sXG4gICAgICAgIFBPV0VSVE9PTFNfU0VSVklDRV9OQU1FOiAncHJvZHVjdFNlcnZpY2UnLFxuICAgICAgICBQT1dFUlRPT0xTX01FVFJJQ1NfTkFNRVNQQUNFOiAnUHJvZHVjdHNBcHAnLFxuICAgICAgICBMT0dfTEVWRUw6ICdJTkZPJyxcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGdldFByb2R1Y3RzQnlJZEZ1bmN0aW9uID0gbmV3IG5vZGVqcy5Ob2RlanNGdW5jdGlvbih0aGlzLCBcImdldFByb2R1Y3RzQnlJZFwiLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2dldFByb2R1Y3RzQnlJZC9pbmRleC50c1wiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFBST0RVQ1RTX1RBQkxFOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgU1RPQ0tTX1RBQkxFOiBzdG9ja3NUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFJFR0lPTjogY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbixcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZVByb2R1Y3RGdW5jdGlvbiA9IG5ldyBub2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgXCJjcmVhdGVQcm9kdWN0XCIsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxuICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXG4gICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9sYW1iZGEvY3JlYXRlUHJvZHVjdC9pbmRleC50c1wiKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFBST0RVQ1RTX1RBQkxFOiBwcm9kdWN0c1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgU1RPQ0tTX1RBQkxFOiBzdG9ja3NUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFJFR0lPTjogY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbixcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEdyYW50IHBlcm1pc3Npb25zIHRvIExhbWJkYVxuICAgIHByb2R1Y3RzVGFibGUuZ3JhbnRSZWFkRGF0YShnZXRQcm9kdWN0c0xpc3RGdW5jdGlvbik7XG4gICAgcHJvZHVjdHNUYWJsZS5ncmFudFJlYWREYXRhKGdldFByb2R1Y3RzQnlJZEZ1bmN0aW9uKTtcbiAgICBwcm9kdWN0c1RhYmxlLmdyYW50V3JpdGVEYXRhKGNyZWF0ZVByb2R1Y3RGdW5jdGlvbik7XG5cbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWREYXRhKGdldFByb2R1Y3RzTGlzdEZ1bmN0aW9uKTtcbiAgICBzdG9ja3NUYWJsZS5ncmFudFJlYWREYXRhKGdldFByb2R1Y3RzQnlJZEZ1bmN0aW9uKTtcbiAgICBzdG9ja3NUYWJsZS5ncmFudFdyaXRlRGF0YShjcmVhdGVQcm9kdWN0RnVuY3Rpb24pO1xuXG4gICAgY29uc3QgcHJvZHVjdHMgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShcInByb2R1Y3RzXCIpO1xuXG4gICAgcHJvZHVjdHMuYWRkTWV0aG9kKFxuICAgICAgXCJHRVRcIixcbiAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldFByb2R1Y3RzTGlzdEZ1bmN0aW9uLCB7XG4gICAgICAgIHByb3h5OiB0cnVlLFxuICAgICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCI6ICd7IFwic3RhdHVzQ29kZVwiOiBcIjIwMFwiIH0nLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIHByb2R1Y3RzLmFkZE1ldGhvZChcbiAgICAgIFwiUE9TVFwiLFxuICAgICAgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oY3JlYXRlUHJvZHVjdEZ1bmN0aW9uLCB7XG4gICAgICAgIHByb3h5OiB0cnVlLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmFkZFJlc291cmNlKFwie2lkfVwiKTtcblxuICAgIHByb2R1Y3QuYWRkTWV0aG9kKFxuICAgICAgXCJHRVRcIixcbiAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKFxuICAgICAgICBuZXcgbm9kZWpzLk5vZGVqc0Z1bmN0aW9uKHRoaXMsIFwiZ2V0UHJvZHVjdHNCeUlkR2V0XCIsIHtcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgICAgICBlbnRyeTogcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9sYW1iZGEvZ2V0UHJvZHVjdHNCeUlkL2luZGV4LnRzXCIpLFxuICAgICAgICB9KSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3h5OiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgLy8gQWRkIEFQSSBHYXRld2F5IHJlc3BvbnNlIChvcHRpb25hbClcbiAgICBhcGkuYWRkR2F0ZXdheVJlc3BvbnNlKFwiRGVmYXVsdEVycm9yXCIsIHtcbiAgICAgIHR5cGU6IGFwaWdhdGV3YXkuUmVzcG9uc2VUeXBlLkRFRkFVTFRfNFhYLFxuICAgICAgcmVzcG9uc2VIZWFkZXJzOiB7XG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiJyonXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0IHRoZSBBUEkgVVJMXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJBcGlVcmxcIiwge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgICBkZXNjcmlwdGlvbjogXCJBUEkgR2F0ZXdheSBVUkxcIixcbiAgICB9KTtcbiAgfVxufVxuIl19