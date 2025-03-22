import csvParser from "csv-parser";
import { Logger } from "@aws-lambda-powertools/logger";
import { S3Event } from "aws-lambda";
import { SQS } from "@aws-sdk/client-sqs";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as dotenv from "dotenv";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const sqs = new SQS();
const logger = new Logger({ serviceName: "importFileParser" });

dotenv.config({ path: "../.env" });

async function moveFile(bucket: string, sourceKey: string): Promise<void> {
  try {
    // Ensure we're only moving files from the uploaded directory
    if (!sourceKey.startsWith("uploaded/")) {
      logger.error("File is not in the uploaded directory");
    }

    // Construct the new key for parsed folder
    const parsedKey = sourceKey.replace("uploaded/", "parsed/");

    logger.info(`Moving file from ${sourceKey} to ${parsedKey}`);

    // Copy the file to the parsed directory
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${sourceKey}`,
        Key: parsedKey,
      }),
    );

    logger.info(`Successfully copied file to ${parsedKey}`);

    // Delete the original file from uploaded directory
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
      }),
    );

    logger.info(`Successfully deleted original file from ${sourceKey}`);
  } catch (error) {
    logger.error("Error moving file:", { error });
    throw error;
  }
}

export const handler = async (event: S3Event): Promise<void> => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      logger.info(`Processing file ${key} from bucket ${bucket}`);

      // Process the CSV file here
      const { Body } = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );

      if (Body instanceof Readable) {
        await new Promise((resolve, reject) => {
          Body.pipe(csvParser())
            .on("data", async (data) => {
              logger.info(`Data chunk: ${JSON.stringify(data)}`);

              await sqs.sendMessage({
                QueueUrl: process.env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify(data),
              });
            })
            .on("end", async () => {
              try {
                await moveFile(bucket, key);

                logger.info(
                  `Successfully sent message to SQS and moved file ${key} to parsed folder`,
                );

                resolve(null);
              } catch (error) {
                reject(error);
              }
            })
            .on("error", (error) => {
              reject(error);
            });
        });
      }
    }
  } catch (error) {
    logger.error("Error in handler:", { error });
    throw error;
  }
};
