import { v4 as uuidv4 } from "uuid";
import { SQSEvent } from "aws-lambda";
import { SNS } from "@aws-sdk/client-sns";
import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const logger = new Logger({ serviceName: "catalogBatchProcess" });
const sns = new SNS();
const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    logger.info("Processing batch:", { event });

    // Process each record individually
    for (const record of event.Records) {
      try {
        // Parse the individual record
        const product = JSON.parse(record.body);
        logger.info("Processing product:", { product });

        // Generate a unique ID for each product
        const productId = uuidv4();

        // Create product in products table
        await dynamodb.send(
          new PutCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
              id: productId,
              title: product.title,
              description: product.description || "",
              price: product.price,
            },
          }),
        );

        // Create stock in stocks table
        await dynamodb.send(
          new PutCommand({
            TableName: process.env.STOCKS_TABLE,
            Item: {
              product_id: productId,
              count: product.count,
            },
          }),
        );

        try {
          logger.info("Attempting to publish to SNS", {
            topicArn: process.env.SNS_TOPIC_ARN,
            product: product,
          });

          const snsResponse = await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Subject: "New Product Created",
            Message: JSON.stringify({
              message:
                product.price >= 100
                  ? "New premium product added to catalog"
                  : "New product added to catalog",
              product: {
                id: product.id,
                title: product.title,
                price: product.price,
              },
            }),
          });

          logger.info("Successfully published to SNS", {
            messageId: snsResponse.MessageId,
            topicArn: process.env.SNS_TOPIC_ARN,
          });
        } catch (snsError) {
          logger.error("Failed to publish to SNS", {
            error: snsError,
            topicArn: process.env.SNS_TOPIC_ARN,
            product: product,
          });
          throw snsError;
        }
      } catch (error) {
        logger.error("Error processing individual record:", {
          error,
          record: record.body,
        });
        // You might want to throw here depending on your error handling strategy
      }
    }
  } catch (error) {
    logger.error("Error processing batch:", { error });
    throw error;
  }
};
