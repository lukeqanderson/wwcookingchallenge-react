/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_WWCOOKINGCHALLENGECOUNTRYDESCDDB_ARN
	STORAGE_WWCOOKINGCHALLENGECOUNTRYDESCDDB_NAME
	STORAGE_WWCOOKINGCHALLENGECOUNTRYDESCDDB_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
    DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "wwcookingchallengeCountryDescDDB-dev";

exports.handler = async (event) => {
  const method = event.httpMethod;


  let response = "";

  if (method === "GET") {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        country: event.queryStringParameters.country,
      },
    });
    response = (await docClient.send(getCommand)).Item;
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);
      const putCommand = new PutCommand({
        Item: {
          country: event.queryStringParameters.country,
          description: body,
        },
        TableName: tableName,
      });
      response = (await docClient.send(putCommand));
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