// src/functions/basicAuthorizer/handler.ts

export const handler = async (event: any) => {
  console.log("Event: ", JSON.stringify(event));

  // Extract authorization header
  const { authorizationToken, methodArn } = event;

  if (!authorizationToken) {
    return generatePolicy("user", "Deny", methodArn);
  }

  try {
    // Remove "Basic " from the token
    const token = authorizationToken.replace("Basic ", "");
    // Decode base64
    const credentials = Buffer.from(token, "base64").toString("utf-8");

    // TODO :: remove log
    console.log("Credentials: ", credentials);

    const [username, password] = credentials.split(":");

    // Get credentials from environment variables
    const storedCredentials = process.env[username];

    const effect =
      !storedCredentials || storedCredentials !== password ? "Deny" : "Allow";

    return generatePolicy("user", effect, methodArn);
  } catch (error) {
    return generatePolicy("user", "Deny", methodArn);
  }
};

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
) => {
  return {
    principalId,
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
  };
};
