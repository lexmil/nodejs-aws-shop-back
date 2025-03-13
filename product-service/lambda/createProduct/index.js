"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const logger_1 = require("@aws-lambda-powertools/logger");
const metrics_1 = require("@aws-lambda-powertools/metrics");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const logger = new logger_1.Logger({
    serviceName: 'productService',
    logLevel: 'INFO'
});
const metrics = new metrics_1.Metrics({
    namespace: 'ProductsApp',
    serviceName: 'productService',
    defaultDimensions: {
        environment: process.env.ENVIRONMENT || 'development'
    }
});
const client = new client_dynamodb_1.DynamoDBClient({
    region: process.env.REGION
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const createResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body)
});
const validateProduct = (product) => {
    const errors = [];
    if (!product.title?.trim())
        errors.push('Title is required');
    if (!product.description?.trim())
        errors.push('Description is required');
    if (typeof product.price !== 'number' || product.price <= 0)
        errors.push('Price must be a positive number');
    if (typeof product.count !== 'number' || product.count < 0)
        errors.push('Count must be a non-negative number');
    return errors;
};
const handler = async (event) => {
    logger.addContext(event);
    const startTime = Date.now();
    try {
        logger.info('Creating new product', {
            operation: 'createProduct'
        });
        metrics.addMetric('createProductInvocations', metrics_1.MetricUnit.Count, 1);
        let productData;
        try {
            productData = JSON.parse(event.body);
        }
        catch (e) {
            logger.error('Invalid JSON in request body');
            metrics.addMetric('invalidJsonErrors', metrics_1.MetricUnit.Count, 1);
            return createResponse(400, {
                message: 'Invalid JSON in request body'
            });
        }
        // Validate input
        const validationErrors = validateProduct(productData);
        if (validationErrors.length > 0) {
            logger.error('Validation failed', { errors: validationErrors });
            metrics.addMetric('validationErrors', metrics_1.MetricUnit.Count, 1);
            return createResponse(400, {
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        const productId = (0, uuid_1.v4)();
        logger.info('Generated new product ID', { productId });
        const { title, description, price, count } = productData;
        // Prepare the product and stock items
        const productItem = {
            id: productId,
            title,
            description,
            price,
        };
        const stockItem = {
            product_id: productId,
            count,
        };
        // Create TransactWriteCommand input
        const transactParams = {
            TransactItems: [
                {
                    Put: {
                        TableName: process.env.PRODUCTS_TABLE,
                        Item: productItem,
                        // Ensure the product doesn't already exist
                        ConditionExpression: 'attribute_not_exists(id)',
                    }
                },
                {
                    Put: {
                        TableName: process.env.STOCKS_TABLE,
                        Item: stockItem,
                        // Ensure the stock doesn't already exist
                        ConditionExpression: 'attribute_not_exists(product_id)',
                    }
                }
            ]
        };
        try {
            const command = new lib_dynamodb_1.TransactWriteCommand(transactParams);
            await docClient.send(command);
            logger.info('Product and stock created successfully', {
                productId,
                title,
                executionTime: Date.now() - startTime
            });
            metrics.addMetric('productsCreated', metrics_1.MetricUnit.Count, 1);
            metrics.addMetric('createProductLatency', metrics_1.MetricUnit.Milliseconds, Date.now() - startTime);
            return createResponse(201, {
                message: 'Product created successfully',
                product: {
                    ...productItem,
                    count: stockItem.count
                }
            });
        }
        catch (transactionError) {
            logger.error('Transaction failed', {
                error: transactionError.message,
                errorName: transactionError.name,
                stackTrace: transactionError.stack
            });
            if (transactionError.name === 'TransactionCanceledException') {
                const cancellationReasons = transactionError.CancellationReasons;
                logger.error('Transaction cancelled', { cancellationReasons });
                metrics.addMetric('transactionCancellations', metrics_1.MetricUnit.Count, 1);
                return createResponse(409, {
                    message: 'Failed to create product due to conflict',
                    error: process.env.IS_OFFLINE
                        ? `Transaction cancelled: ${transactionError.message}`
                        : 'Transaction failed'
                });
            }
            throw transactionError; // Re-throw for general error handling
        }
    }
    catch (error) {
        logger.error('Error creating product', {
            error: error.message,
            errorName: error.name,
            stackTrace: error.stack,
            executionTime: Date.now() - startTime
        });
        metrics.addMetric('productCreationErrors', metrics_1.MetricUnit.Count, 1);
        metrics.addMetric('createProductLatency', metrics_1.MetricUnit.Milliseconds, Date.now() - startTime);
        return createResponse(500, {
            message: 'Internal server error while creating product',
            error: process.env.IS_OFFLINE ? error.message : 'Internal server error'
        });
    }
    finally {
        metrics.publishStoredMetrics();
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBdUQ7QUFDdkQsNERBQXFFO0FBQ3JFLDhEQUEwRDtBQUMxRCx3REFJK0I7QUFDL0IsK0JBQW9DO0FBRXBDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDO0lBQ3pCLFdBQVcsRUFBRSxnQkFBZ0I7SUFDN0IsUUFBUSxFQUFFLE1BQU07Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDO0lBQzNCLFNBQVMsRUFBRSxhQUFhO0lBQ3hCLFdBQVcsRUFBRSxnQkFBZ0I7SUFDN0IsaUJBQWlCLEVBQUU7UUFDbEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLGFBQWE7S0FDckQ7Q0FDRCxDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUM7SUFDakMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTtDQUMxQixDQUFDLENBQUM7QUFDSCxNQUFNLFNBQVMsR0FBRyxxQ0FBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFxQnRELE1BQU0sY0FBYyxHQUFHLENBQUMsVUFBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUQsVUFBVTtJQUNWLE9BQU8sRUFBRTtRQUNSLDZCQUE2QixFQUFFLEdBQUc7UUFDbEMsa0NBQWtDLEVBQUUsSUFBSTtLQUN4QztJQUNELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztDQUMxQixDQUFDLENBQUM7QUFFSCxNQUFNLGVBQWUsR0FBRyxDQUFDLE9BQXVCLEVBQVksRUFBRTtJQUM3RCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQUUs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RUFBRSxvQkFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFM0YsT0FBTyxjQUFjLENBQUMsR0FBRyxFQUFFO1lBQzFCLE9BQU8sRUFBRSw4Q0FBOEM7WUFDdkQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7U0FDdkUsQ0FBQyxDQUFDO0lBQ0osQ0FBQztZQUFTLENBQUM7UUFDVixPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDO0FBdklXLFFBQUEsT0FBTyxXQXVJbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dnZXIgfSBmcm9tICdAYXdzLWxhbWJkYS1wb3dlcnRvb2xzL2xvZ2dlcic7XG5pbXBvcnQgeyBNZXRyaWNzLCBNZXRyaWNVbml0IH0gZnJvbSAnQGF3cy1sYW1iZGEtcG93ZXJ0b29scy9tZXRyaWNzJztcbmltcG9ydCB7IER5bmFtb0RCQ2xpZW50IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xuaW1wb3J0IHtcblx0RHluYW1vREJEb2N1bWVudENsaWVudCxcblx0VHJhbnNhY3RXcml0ZUNvbW1hbmQsXG5cdFRyYW5zYWN0V3JpdGVDb21tYW5kSW5wdXRcbn0gZnJvbSBcIkBhd3Mtc2RrL2xpYi1keW5hbW9kYlwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoe1xuXHRzZXJ2aWNlTmFtZTogJ3Byb2R1Y3RTZXJ2aWNlJyxcblx0bG9nTGV2ZWw6ICdJTkZPJ1xufSk7XG5cbmNvbnN0IG1ldHJpY3MgPSBuZXcgTWV0cmljcyh7XG5cdG5hbWVzcGFjZTogJ1Byb2R1Y3RzQXBwJyxcblx0c2VydmljZU5hbWU6ICdwcm9kdWN0U2VydmljZScsXG5cdGRlZmF1bHREaW1lbnNpb25zOiB7XG5cdFx0ZW52aXJvbm1lbnQ6IHByb2Nlc3MuZW52LkVOVklST05NRU5UIHx8ICdkZXZlbG9wbWVudCdcblx0fVxufSk7XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7XG5cdHJlZ2lvbjogcHJvY2Vzcy5lbnYuUkVHSU9OXG59KTtcbmNvbnN0IGRvY0NsaWVudCA9IER5bmFtb0RCRG9jdW1lbnRDbGllbnQuZnJvbShjbGllbnQpO1xuXG5pbnRlcmZhY2UgUHJvZHVjdFJlcXVlc3Qge1xuXHR0aXRsZTogc3RyaW5nO1xuXHRkZXNjcmlwdGlvbjogc3RyaW5nO1xuXHRwcmljZTogbnVtYmVyO1xuXHRjb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgUHJvZHVjdCB7XG5cdGlkOiBzdHJpbmc7XG5cdHRpdGxlOiBzdHJpbmc7XG5cdGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cdHByaWNlOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBTdG9jayB7XG5cdHByb2R1Y3RfaWQ6IHN0cmluZztcblx0Y291bnQ6IG51bWJlcjtcbn1cblxuY29uc3QgY3JlYXRlUmVzcG9uc2UgPSAoc3RhdHVzQ29kZTogbnVtYmVyLCBib2R5OiBhbnkpID0+ICh7XG5cdHN0YXR1c0NvZGUsXG5cdGhlYWRlcnM6IHtcblx0XHQnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuXHRcdCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXG5cdH0sXG5cdGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXG59KTtcblxuY29uc3QgdmFsaWRhdGVQcm9kdWN0ID0gKHByb2R1Y3Q6IFByb2R1Y3RSZXF1ZXN0KTogc3RyaW5nW10gPT4ge1xuXHRjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG5cblx0aWYgKCFwcm9kdWN0LnRpdGxlPy50cmltKCkpIGVycm9ycy5wdXNoKCdUaXRsZSBpcyByZXF1aXJlZCcpO1xuXHRpZiAoIXByb2R1Y3QuZGVzY3JpcHRpb24/LnRyaW0oKSkgZXJyb3JzLnB1c2goJ0Rlc2NyaXB0aW9uIGlzIHJlcXVpcmVkJyk7XG5cdGlmICh0eXBlb2YgcHJvZHVjdC5wcmljZSAhPT0gJ251bWJlcicgfHwgcHJvZHVjdC5wcmljZSA8PSAwKSBlcnJvcnMucHVzaCgnUHJpY2UgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuXHRpZiAodHlwZW9mIHByb2R1Y3QuY291bnQgIT09ICdudW1iZXInIHx8IHByb2R1Y3QuY291bnQgPCAwKSBlcnJvcnMucHVzaCgnQ291bnQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXInKTtcblxuXHRyZXR1cm4gZXJyb3JzO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSkgPT4ge1xuXHRsb2dnZXIuYWRkQ29udGV4dChldmVudCk7XG5cdGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cblx0dHJ5IHtcblx0XHRsb2dnZXIuaW5mbygnQ3JlYXRpbmcgbmV3IHByb2R1Y3QnLCB7XG5cdFx0XHRvcGVyYXRpb246ICdjcmVhdGVQcm9kdWN0J1xuXHRcdH0pO1xuXHRcdG1ldHJpY3MuYWRkTWV0cmljKCdjcmVhdGVQcm9kdWN0SW52b2NhdGlvbnMnLCBNZXRyaWNVbml0LkNvdW50LCAxKTtcblxuXHRcdGxldCBwcm9kdWN0RGF0YTogUHJvZHVjdFJlcXVlc3Q7XG5cdFx0dHJ5IHtcblx0XHRcdHByb2R1Y3REYXRhID0gSlNPTi5wYXJzZShldmVudC5ib2R5KTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRsb2dnZXIuZXJyb3IoJ0ludmFsaWQgSlNPTiBpbiByZXF1ZXN0IGJvZHknKTtcblx0XHRcdG1ldHJpY3MuYWRkTWV0cmljKCdpbnZhbGlkSnNvbkVycm9ycycsIE1ldHJpY1VuaXQuQ291bnQsIDEpO1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVJlc3BvbnNlKDQwMCwge1xuXHRcdFx0XHRtZXNzYWdlOiAnSW52YWxpZCBKU09OIGluIHJlcXVlc3QgYm9keSdcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIFZhbGlkYXRlIGlucHV0XG5cdFx0Y29uc3QgdmFsaWRhdGlvbkVycm9ycyA9IHZhbGlkYXRlUHJvZHVjdChwcm9kdWN0RGF0YSk7XG5cdFx0aWYgKHZhbGlkYXRpb25FcnJvcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0bG9nZ2VyLmVycm9yKCdWYWxpZGF0aW9uIGZhaWxlZCcsIHsgZXJyb3JzOiB2YWxpZGF0aW9uRXJyb3JzIH0pO1xuXHRcdFx0bWV0cmljcy5hZGRNZXRyaWMoJ3ZhbGlkYXRpb25FcnJvcnMnLCBNZXRyaWNVbml0LkNvdW50LCAxKTtcblx0XHRcdHJldHVybiBjcmVhdGVSZXNwb25zZSg0MDAsIHtcblx0XHRcdFx0bWVzc2FnZTogJ1ZhbGlkYXRpb24gZmFpbGVkJyxcblx0XHRcdFx0ZXJyb3JzOiB2YWxpZGF0aW9uRXJyb3JzXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRjb25zdCBwcm9kdWN0SWQgPSB1dWlkdjQoKTtcblx0XHRsb2dnZXIuaW5mbygnR2VuZXJhdGVkIG5ldyBwcm9kdWN0IElEJywgeyBwcm9kdWN0SWQgfSk7XG5cblx0XHRjb25zdCB7IHRpdGxlLCBkZXNjcmlwdGlvbiwgcHJpY2UsIGNvdW50IH0gPSBwcm9kdWN0RGF0YTtcblxuXHRcdC8vIFByZXBhcmUgdGhlIHByb2R1Y3QgYW5kIHN0b2NrIGl0ZW1zXG5cdFx0Y29uc3QgcHJvZHVjdEl0ZW06IFByb2R1Y3QgPSB7XG5cdFx0XHRpZDogcHJvZHVjdElkLFxuXHRcdFx0dGl0bGUsXG5cdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdHByaWNlLFxuXHRcdH07XG5cblx0XHRjb25zdCBzdG9ja0l0ZW06IFN0b2NrID0ge1xuXHRcdFx0cHJvZHVjdF9pZDogcHJvZHVjdElkLFxuXHRcdFx0Y291bnQsXG5cdFx0fTtcblxuXHRcdC8vIENyZWF0ZSBUcmFuc2FjdFdyaXRlQ29tbWFuZCBpbnB1dFxuXHRcdGNvbnN0IHRyYW5zYWN0UGFyYW1zOiBUcmFuc2FjdFdyaXRlQ29tbWFuZElucHV0ID0ge1xuXHRcdFx0VHJhbnNhY3RJdGVtczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0UHV0OiB7XG5cdFx0XHRcdFx0XHRUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlBST0RVQ1RTX1RBQkxFISxcblx0XHRcdFx0XHRcdEl0ZW06IHByb2R1Y3RJdGVtLFxuXHRcdFx0XHRcdFx0Ly8gRW5zdXJlIHRoZSBwcm9kdWN0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuXHRcdFx0XHRcdFx0Q29uZGl0aW9uRXhwcmVzc2lvbjogJ2F0dHJpYnV0ZV9ub3RfZXhpc3RzKGlkKScsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0UHV0OiB7XG5cdFx0XHRcdFx0XHRUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlNUT0NLU19UQUJMRSEsXG5cdFx0XHRcdFx0XHRJdGVtOiBzdG9ja0l0ZW0sXG5cdFx0XHRcdFx0XHQvLyBFbnN1cmUgdGhlIHN0b2NrIGRvZXNuJ3QgYWxyZWFkeSBleGlzdFxuXHRcdFx0XHRcdFx0Q29uZGl0aW9uRXhwcmVzc2lvbjogJ2F0dHJpYnV0ZV9ub3RfZXhpc3RzKHByb2R1Y3RfaWQpJyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9O1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNvbW1hbmQgPSBuZXcgVHJhbnNhY3RXcml0ZUNvbW1hbmQodHJhbnNhY3RQYXJhbXMpO1xuXHRcdFx0YXdhaXQgZG9jQ2xpZW50LnNlbmQoY29tbWFuZCk7XG5cblx0XHRcdGxvZ2dlci5pbmZvKCdQcm9kdWN0IGFuZCBzdG9jayBjcmVhdGVkIHN1Y2Nlc3NmdWxseScsIHtcblx0XHRcdFx0cHJvZHVjdElkLFxuXHRcdFx0XHR0aXRsZSxcblx0XHRcdFx0ZXhlY3V0aW9uVGltZTogRGF0ZS5ub3coKSAtIHN0YXJ0VGltZVxuXHRcdFx0fSk7XG5cblx0XHRcdG1ldHJpY3MuYWRkTWV0cmljKCdwcm9kdWN0c0NyZWF0ZWQnLCBNZXRyaWNVbml0LkNvdW50LCAxKTtcblx0XHRcdG1ldHJpY3MuYWRkTWV0cmljKCdjcmVhdGVQcm9kdWN0TGF0ZW5jeScsIE1ldHJpY1VuaXQuTWlsbGlzZWNvbmRzLCBEYXRlLm5vdygpIC0gc3RhcnRUaW1lLCk7XG5cblx0XHRcdHJldHVybiBjcmVhdGVSZXNwb25zZSgyMDEsIHtcblx0XHRcdFx0bWVzc2FnZTogJ1Byb2R1Y3QgY3JlYXRlZCBzdWNjZXNzZnVsbHknLFxuXHRcdFx0XHRwcm9kdWN0OiB7XG5cdFx0XHRcdFx0Li4ucHJvZHVjdEl0ZW0sXG5cdFx0XHRcdFx0Y291bnQ6IHN0b2NrSXRlbS5jb3VudFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH0gY2F0Y2ggKHRyYW5zYWN0aW9uRXJyb3I6IGFueSkge1xuXHRcdFx0bG9nZ2VyLmVycm9yKCdUcmFuc2FjdGlvbiBmYWlsZWQnLCB7XG5cdFx0XHRcdGVycm9yOiB0cmFuc2FjdGlvbkVycm9yLm1lc3NhZ2UsXG5cdFx0XHRcdGVycm9yTmFtZTogdHJhbnNhY3Rpb25FcnJvci5uYW1lLFxuXHRcdFx0XHRzdGFja1RyYWNlOiB0cmFuc2FjdGlvbkVycm9yLnN0YWNrXG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKHRyYW5zYWN0aW9uRXJyb3IubmFtZSA9PT0gJ1RyYW5zYWN0aW9uQ2FuY2VsZWRFeGNlcHRpb24nKSB7XG5cdFx0XHRcdGNvbnN0IGNhbmNlbGxhdGlvblJlYXNvbnMgPSB0cmFuc2FjdGlvbkVycm9yLkNhbmNlbGxhdGlvblJlYXNvbnM7XG5cdFx0XHRcdGxvZ2dlci5lcnJvcignVHJhbnNhY3Rpb24gY2FuY2VsbGVkJywgeyBjYW5jZWxsYXRpb25SZWFzb25zIH0pO1xuXG5cdFx0XHRcdG1ldHJpY3MuYWRkTWV0cmljKCd0cmFuc2FjdGlvbkNhbmNlbGxhdGlvbnMnLCBNZXRyaWNVbml0LkNvdW50LCAxKTtcblxuXHRcdFx0XHRyZXR1cm4gY3JlYXRlUmVzcG9uc2UoNDA5LCB7XG5cdFx0XHRcdFx0bWVzc2FnZTogJ0ZhaWxlZCB0byBjcmVhdGUgcHJvZHVjdCBkdWUgdG8gY29uZmxpY3QnLFxuXHRcdFx0XHRcdGVycm9yOiBwcm9jZXNzLmVudi5JU19PRkZMSU5FXG5cdFx0XHRcdFx0XHQ/IGBUcmFuc2FjdGlvbiBjYW5jZWxsZWQ6ICR7dHJhbnNhY3Rpb25FcnJvci5tZXNzYWdlfWBcblx0XHRcdFx0XHRcdDogJ1RyYW5zYWN0aW9uIGZhaWxlZCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRocm93IHRyYW5zYWN0aW9uRXJyb3I7IC8vIFJlLXRocm93IGZvciBnZW5lcmFsIGVycm9yIGhhbmRsaW5nXG5cdFx0fVxuXG5cdH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcblx0XHRsb2dnZXIuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHByb2R1Y3QnLCB7XG5cdFx0XHRlcnJvcjogZXJyb3IubWVzc2FnZSxcblx0XHRcdGVycm9yTmFtZTogZXJyb3IubmFtZSxcblx0XHRcdHN0YWNrVHJhY2U6IGVycm9yLnN0YWNrLFxuXHRcdFx0ZXhlY3V0aW9uVGltZTogRGF0ZS5ub3coKSAtIHN0YXJ0VGltZVxuXHRcdH0pO1xuXG5cdFx0bWV0cmljcy5hZGRNZXRyaWMoJ3Byb2R1Y3RDcmVhdGlvbkVycm9ycycsIE1ldHJpY1VuaXQuQ291bnQsIDEpO1xuXHRcdG1ldHJpY3MuYWRkTWV0cmljKCdjcmVhdGVQcm9kdWN0TGF0ZW5jeScsIE1ldHJpY1VuaXQuTWlsbGlzZWNvbmRzLCBEYXRlLm5vdygpIC0gc3RhcnRUaW1lKTtcblxuXHRcdHJldHVybiBjcmVhdGVSZXNwb25zZSg1MDAsIHtcblx0XHRcdG1lc3NhZ2U6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3Igd2hpbGUgY3JlYXRpbmcgcHJvZHVjdCcsXG5cdFx0XHRlcnJvcjogcHJvY2Vzcy5lbnYuSVNfT0ZGTElORSA/IGVycm9yLm1lc3NhZ2UgOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJ1xuXHRcdH0pO1xuXHR9IGZpbmFsbHkge1xuXHRcdG1ldHJpY3MucHVibGlzaFN0b3JlZE1ldHJpY3MoKTtcblx0fVxufTtcbiJdfQ==