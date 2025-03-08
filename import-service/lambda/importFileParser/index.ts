import csvParser from "csv-parser";

import { Logger } from "@aws-lambda-powertools/logger";
import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const logger = new Logger({ serviceName: "importFileParser" });

export const handler = async (event: S3Event): Promise<void> => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      logger.info(`(${bucket}) CSV file handling ${key}`);

      const { Body } = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );

      if (Body instanceof Readable) {
        await new Promise((resolve, reject) => {
          Body.pipe(csvParser())
            .on("data", (data: any) =>
              logger.info("Parsing in progress", { data }),
            )
            .on("error", (error: any) => {
              logger.error("Parsing error", { error });
              reject(error);
            })
            .on("end", () => {
              logger.info("Parsing finished");
              resolve(null);
            });
        });
      } else {
        logger.error("Failed to get readable stream from S3 object");
      }
    }
  } catch (error) {
    logger.error("Error in handler", { error });
    throw error;
  }
};
