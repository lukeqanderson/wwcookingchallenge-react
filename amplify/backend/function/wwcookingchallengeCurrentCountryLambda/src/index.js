/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_WWCOOKINGCHALLENGECURRENTCOUNTRYDDB_ARN
	STORAGE_WWCOOKINGCHALLENGECURRENTCOUNTRYDDB_NAME
	STORAGE_WWCOOKINGCHALLENGECURRENTCOUNTRYDDB_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {
    DynamoDBDocumentClient,
    GetCommand,
    QueryCommand,
    DeleteCommand,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
    DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "wwcookingchallengeCurrentCountryDDB-dev";

exports.handler = async (event) => {
  const method = event.httpMethod;
  const username = event.queryStringParameters.username;


  let response;

  if (method === "GET") {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        username: username,
      },
    });
    response = (await docClient.send(getCommand)).Item;
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);
      const putCommand = new PutCommand({
        Item: {
          username: username,
          country: body,
        },
        TableName: tableName,
      });
      response = (await docClient.send(putCommand));
  }

  if (method === "DELETE") {
    const deleteCommand = new DeleteCommand ({
    TableName: tableName,
    Key: {
        username: username,
    },
    })
    await docClient.send(deleteCommand);
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
