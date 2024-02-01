/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_WWCOOKINGCHALLENGEDDB_ARN
	STORAGE_WWCOOKINGCHALLENGEDDB_NAME
	STORAGE_WWCOOKINGCHALLENGEDDB_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {
    DynamoDBDocumentClient,
    QueryCommand,
    DeleteCommand,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
    DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "wwcookingchallengeDDB-dev";

exports.handler = async (event) => {
  const method = event.httpMethod;
  const username = event.queryStringParameters.username;

  let response;

  if (method === "POST") {
    const body = JSON.parse(JSON.parse(event.body));
    console.log(body);
      const country = body.country;
      console.log(country);
      const completed = body.completed;
      console.log(completed);
      const putCommand = new PutCommand({
        Item: {
          username: username,
          country: country,
          completed: completed, 
        },
        TableName: tableName,
      });
      response = await docClient.send(putCommand);
    }
  

  if (method === "DELETE") {
    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "username = :username AND country > :country",
      ExpressionAttributeValues: {
        ":username": username,
        ":country": "!",
      },
      ConsistentRead: true,
    });
    deleteItemArray = (await docClient.send(queryCommand)).Items;
    for (let i = 0; i < deleteItemArray.length; i++) {
      const deleteCommand = new DeleteCommand ({
        TableName: tableName,
        Key: {
          username: username,
          country: deleteItemArray[i].country,
        },
      })
      await docClient.send(deleteCommand);
    }
  }

  return {
      statusCode: 200,
  //  Uncomment below to enable CORS requests
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
      body: JSON.stringify(response),
  };
};