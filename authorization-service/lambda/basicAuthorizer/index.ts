// In your authorization service lambda (basicAuthorizer)
export const handler = async (event: any) => {
  console.log("Event: ", event);

  try {
    const { authorizationToken, methodArn } = event;

    // If no token provided or wrong format
    if (
      !authorizationToken ||
      !authorizationToken.toLowerCase().startsWith("basic ")
    ) {
      throw new Error("Unauthorized"); // This will trigger 401
    }

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`username: ${username}`);

    const storedUserName = process.env.LOGIN;
    const storedPassword = process.env.PASSWORD;

    // Check credentials
    if (username !== storedUserName || password !== storedPassword) {
      throw new Error("Unauthorized"); // This will trigger 401
    }

    // If credentials are valid, return Allow policy
    return {
      principalId: username,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: methodArn,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Authorization error:", error);

    // Instead of returning a policy, throw an error to trigger 401
    throw new Error("Unauthorized");
  }
};
