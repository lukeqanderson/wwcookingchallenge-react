/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_WWCOOKINGCHALLENGEDDB_ARN
	STORAGE_WWCOOKINGCHALLENGEDDB_NAME
	STORAGE_WWCOOKINGCHALLENGEDDB_STREAMARN
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
    DynamoDBDocumentClient,
    GetCommand,
    ScanCommand,
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
  const getCommand = new GetCommand({
    TableName: tableName,
    Key: {
      username: username,
      country:"Singapore",
    },
  });
  const scanCommand = new ScanCommand({
    ProjectionExpression: "#username, country, completed",
    ExpressionAttributeNames: {"#username":username},
    TableName: tableName,
  });

  let response;
  if (method === "GET") {
    response = (await docClient.send(scanCommand)).Items;
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
