import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Logger } from "@aws-lambda-powertools/logger";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const logger = new Logger({ serviceName: "importProductsFile" });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "File name is empty" }),
      };
    }

    if (!process.env.BUCKET_NAME) {
      logger.error("Bucket name is not defined in the environment variables");
    }

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      ContentType: "text/csv",
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    logger.info("Signed URL:", signedUrl);

    return {
      statusCode: 200,
      headers,
      body: signedUrl,
    };
  } catch (error) {
    logger.error("Error:", { error });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
