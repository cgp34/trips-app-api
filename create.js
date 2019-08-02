import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "trips",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      tripId: uuid.v1(),
      tripName: data.tripName,
      methodOfTransport: data.methodOfTransport,
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
