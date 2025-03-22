import { handler } from "../index";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { SQSEvent, SQSRecord } from "aws-lambda";

// Mock AWS SDK clients
const ddbMock = mockClient(DynamoDBDocumentClient);

// Create a complete mock SQS event
const mockSQSEvent: SQSEvent = {
  Records: [
    {
      messageId: "1",
      receiptHandle: "receipt-1",
      body: JSON.stringify({
        title: "Test Product 1",
        description: "Test Description 1",
        price: 100,
        count: 5,
      }),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "1545082649183",
        SenderId: "XXXXXXXXXXXXXXXXXXXXX",
        ApproximateFirstReceiveTimestamp: "1545082649185",
      },
      messageAttributes: {},
      md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:region:account-id:queue-name",
      awsRegion: "eu-central-1",
    },
    {
      messageId: "2",
      receiptHandle: "receipt-2",
      body: JSON.stringify({
        title: "Test Product 2",
        description: "Test Description 2",
        price: 200,
        count: 10,
      }),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "1545082649183",
        SenderId: "XXXXXXXXXXXXXXXXXXXXX",
        ApproximateFirstReceiveTimestamp: "1545082649185",
      },
      messageAttributes: {},
      md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:region:account-id:queue-name",
      awsRegion: "eu-central-1",
    },
  ],
};

describe("catalogBatchProcess handler", () => {
  beforeEach(() => {
    ddbMock.reset();
    process.env.PRODUCTS_TABLE = "test-products-table";
    process.env.STOCKS_TABLE = "test-stocks-table";
  });

  it("should successfully process SQS messages and create products", async () => {
    ddbMock.on(PutCommand).resolves({});
    await handler(mockSQSEvent);

    expect(ddbMock.calls()).toHaveLength(4);

    const firstProductCall = ddbMock.commandCalls(PutCommand)[0];
    expect(firstProductCall.args[0].input).toMatchObject({
      TableName: "test-products-table",
      Item: expect.objectContaining({
        title: "Test Product 1",
        description: "Test Description 1",
        price: 100,
      }),
    });
  });

  it("should handle empty SQS event", async () => {
    const emptyEvent: SQSEvent = { Records: [] };
    await handler(emptyEvent);
    expect(ddbMock.calls()).toHaveLength(0);
  });

  it("should handle invalid JSON in SQS message", async () => {
    const invalidEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "receipt-1",
          body: "invalid json",
          attributes: {
            ApproximateReceiveCount: "1",
            SentTimestamp: "1545082649183",
            SenderId: "XXXXXXXXXXXXXXXXXXXXX",
            ApproximateFirstReceiveTimestamp: "1545082649185",
          },
          messageAttributes: {},
          md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
          eventSource: "aws:sqs",
          eventSourceARN: "arn:aws:sqs:region:account-id:queue-name",
          awsRegion: "eu-central-1",
        },
      ],
    };

    await expect(handler(invalidEvent)).rejects.toThrow();
  });

  // Helper function to create a complete SQS record
  function createMockSQSRecord(data: any): SQSRecord {
    return {
      messageId: Math.random().toString(),
      receiptHandle: `receipt-${Math.random()}`,
      body: JSON.stringify(data),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "1545082649183",
        SenderId: "XXXXXXXXXXXXXXXXXXXXX",
        ApproximateFirstReceiveTimestamp: "1545082649185",
      },
      messageAttributes: {},
      md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:region:account-id:queue-name",
      awsRegion: "eu-central-1",
    };
  }

  it("should handle missing required fields", async () => {
    const invalidProductEvent: SQSEvent = {
      Records: [
        createMockSQSRecord({
          description: "Test Description",
          price: 100,
          count: 5,
          // Missing title
        }),
      ],
    };

    await expect(handler(invalidProductEvent)).rejects.toThrow();
  });

  it("should validate product data types", async () => {
    const invalidTypeEvent: SQSEvent = {
      Records: [
        createMockSQSRecord({
          title: "Test Product",
          description: "Test Description",
          price: "not a number", // Invalid price type
          count: 5,
        }),
      ],
    };

    await expect(handler(invalidTypeEvent)).rejects.toThrow();
  });

  it("should process multiple records in parallel", async () => {
    ddbMock.on(PutCommand).resolves({});

    const start = Date.now();
    await handler(mockSQSEvent);
    const end = Date.now();

    expect(end - start).toBeLessThan(1000);
  });
});
