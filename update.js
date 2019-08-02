import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'tripId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      tripId: event.pathParameters.id
    },
    UpdateExpression: "SET tripName = :tripName, methodOfTransport = :methodOfTransport, destination = :destination, departureDate = :departureDate, returnDate = :returnDate, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":returnDate": data.returnDate || null,
      ":departureDate": data.departureDate || null,
      ":destination": data.destination || null,
      ":methodOfTransport": data.methodOfTransport || null,
      ":tripName": data.tripName || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
