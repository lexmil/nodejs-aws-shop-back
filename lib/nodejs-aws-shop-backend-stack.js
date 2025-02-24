"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodejsAwsShopBackendStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const nodejs = require("aws-cdk-lib/aws-lambda-nodejs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
class NodejsAwsShopBackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new apigateway.RestApi(this, "NodejsAwsShopApi", {
            restApiName: "Shop Service",
            description: "This is the Shop API",
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
            },
        });
        const products = api.root.addResource("products");
        products.addMethod("GET", new apigateway.LambdaIntegration(new nodejs.NodejsFunction(this, "getProductsList", {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "index.handler",
            entry: path.join(__dirname, "../lambda/getProductsList/index.ts"),
        }), {
            proxy: true,
            // Optional: Configure request/response mapping
            requestTemplates: {
                "application/json": '{ "statusCode": "200" }',
            },
        }));
        // GET /products/{id}
        const product = products.addResource("{id}");
        product.addMethod("GET", new apigateway.LambdaIntegration(new nodejs.NodejsFunction(this, "getProductsById", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWF3cy1zaG9wLWJhY2tlbmQtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub2RlanMtYXdzLXNob3AtYmFja2VuZC1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBQ2pELHdEQUF3RDtBQUN4RCx5REFBeUQ7QUFFekQsNkJBQTZCO0FBSTdCLE1BQWEseUJBQTBCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzNELFdBQVcsRUFBRSxjQUFjO1lBQzNCLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWU7YUFDOUM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVsRCxRQUFRLENBQUMsU0FBUyxDQUNoQixLQUFLLEVBQ0wsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQzlCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDakQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUM7U0FDbEUsQ0FBQyxFQUNGO1lBQ0UsS0FBSyxFQUFFLElBQUk7WUFDWCwrQ0FBK0M7WUFDL0MsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGtCQUFrQixFQUFFLHlCQUF5QjthQUM5QztTQUNGLENBQ0YsQ0FDRixDQUFDO1FBRUYscUJBQXFCO1FBQ3JCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLFNBQVMsQ0FDZixLQUFLLEVBQ0wsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQzlCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDakQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUM7U0FDbEUsQ0FBQyxFQUNGO1lBQ0UsS0FBSyxFQUFFLElBQUk7U0FDWixDQUNGLENBQ0YsQ0FBQztRQUVGLHNDQUFzQztRQUN0QyxHQUFHLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFO1lBQ3JDLElBQUksRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLFdBQVc7WUFDekMsZUFBZSxFQUFFO2dCQUNmLDZCQUE2QixFQUFFLEtBQUs7YUFDckM7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFDckIsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoRUQsOERBZ0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBub2RlanMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbmV4cG9ydCBjbGFzcyBOb2RlanNBd3NTaG9wQmFja2VuZFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCBcIk5vZGVqc0F3c1Nob3BBcGlcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IFwiU2hvcCBTZXJ2aWNlXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGlzIGlzIHRoZSBTaG9wIEFQSVwiLFxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgIGFsbG93T3JpZ2luczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TLFxuICAgICAgICBhbGxvd01ldGhvZHM6IGFwaWdhdGV3YXkuQ29ycy5BTExfTUVUSE9EUyxcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBhcGlnYXRld2F5LkNvcnMuREVGQVVMVF9IRUFERVJTLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2R1Y3RzID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJwcm9kdWN0c1wiKTtcblxuICAgIHByb2R1Y3RzLmFkZE1ldGhvZChcbiAgICAgIFwiR0VUXCIsXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihcbiAgICAgICAgbmV3IG5vZGVqcy5Ob2RlanNGdW5jdGlvbih0aGlzLCBcImdldFByb2R1Y3RzTGlzdFwiLCB7XG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXG4gICAgICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2dldFByb2R1Y3RzTGlzdC9pbmRleC50c1wiKSxcbiAgICAgICAgfSksXG4gICAgICAgIHtcbiAgICAgICAgICBwcm94eTogdHJ1ZSxcbiAgICAgICAgICAvLyBPcHRpb25hbDogQ29uZmlndXJlIHJlcXVlc3QvcmVzcG9uc2UgbWFwcGluZ1xuICAgICAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiAneyBcInN0YXR1c0NvZGVcIjogXCIyMDBcIiB9JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgLy8gR0VUIC9wcm9kdWN0cy97aWR9XG4gICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmFkZFJlc291cmNlKFwie2lkfVwiKTtcbiAgICBwcm9kdWN0LmFkZE1ldGhvZChcbiAgICAgIFwiR0VUXCIsXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihcbiAgICAgICAgbmV3IG5vZGVqcy5Ob2RlanNGdW5jdGlvbih0aGlzLCBcImdldFByb2R1Y3RzQnlJZFwiLCB7XG4gICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXG4gICAgICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhL2dldFByb2R1Y3RzQnlJZC9pbmRleC50c1wiKSxcbiAgICAgICAgfSksXG4gICAgICAgIHtcbiAgICAgICAgICBwcm94eTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgKTtcblxuICAgIC8vIEFkZCBBUEkgR2F0ZXdheSByZXNwb25zZSAob3B0aW9uYWwpXG4gICAgYXBpLmFkZEdhdGV3YXlSZXNwb25zZShcIkRlZmF1bHRFcnJvclwiLCB7XG4gICAgICB0eXBlOiBhcGlnYXRld2F5LlJlc3BvbnNlVHlwZS5ERUZBVUxUXzRYWCxcbiAgICAgIHJlc3BvbnNlSGVhZGVyczoge1xuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIicqJ1wiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIE91dHB1dCB0aGUgQVBJIFVSTFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiQXBpVXJsXCIsIHtcbiAgICAgIHZhbHVlOiBhcGkudXJsLFxuICAgICAgZGVzY3JpcHRpb246IFwiQVBJIEdhdGV3YXkgVVJMXCIsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==