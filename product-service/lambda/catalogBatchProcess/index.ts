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
    const products = event.Records.map((record) => JSON.parse(record.body));

    logger.info("Parsing", {
      tableName: process.env.PRODUCTS_TABLE,
      products,
    });

    const productsList = [];
    const productId = uuidv4();

    for (const product of products) {
      const productData = JSON.parse(product.body);
      // Create product in products table
      await dynamodb.send(
        new PutCommand({
          TableName: process.env.PRODUCTS_TABLE,
          Item: {
            id: productId,
            title: productData.title,
            description: productData.description || "",
            price: productData.price,
          },
        }),
      );

      // Create stock in stocks table
      await dynamodb.send(
        new PutCommand({
          TableName: process.env.STOCKS_TABLE,
          Item: {
            product_id: productId,
            count: productData.count,
          },
        }),
      );

      productsList.push(productData);
      logger.info(`Product created: ${JSON.stringify(product)}`);
    }

    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: "New products",
      Message: JSON.stringify({
        message: "These product have been created",
        productsList,
      }),
      MessageAttributes: {
        createdProductsLength: {
          DataType: "Number",
          StringValue: productsList.length.toString(),
        },
        status: {
          DataType: "String",
          StringValue: "success",
        },
      },
    });
  } catch (error) {
    logger.error("Error processing batch:", { error });
    throw error;
  }
};
