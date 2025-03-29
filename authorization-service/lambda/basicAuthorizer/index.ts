import { APIGatewayAuthorizerResult } from "aws-lambda";

export const handler = async (event: any) => {
  console.log("Event: ", event);

  try {
    const { authorizationToken, methodArn } = event;

    // If no token provided or wrong format
    if (!authorizationToken) {
      return generatePolicy("user", "Deny", event.methodArn, {
        statusCode: 401,
      });
    }

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split("=");
    const username = plainCreds[0];
    const password = plainCreds[1];

    const storedUsername = process.env.LOGIN;
    const storedPassword = process.env.PASSWORD;

    // Check credentials
    if (username !== storedUsername || password !== storedPassword) {
      return generatePolicy("user", "Deny", event.methodArn, {
        statusCode: 403,
      });
    }

    return generatePolicy("user", "Allow", event.methodArn, {
      statusCode: 200,
    });
  } catch (error) {
    return generatePolicy("user", "Deny", event.methodArn, {
      statusCode: 500,
    });
  }
};

const generatePolicy = (
  principalId: string,
  effect: "Allow" | "Deny",
  resource: string,
  context: any = null,
): APIGatewayAuthorizerResult => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
};
