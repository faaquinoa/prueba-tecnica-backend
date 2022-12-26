import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { Controller } from './context/token/consult/infraestructure/Controller';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

    let response: APIGatewayProxyResult = await Controller(event.body || '{}', event.headers['Authorization'] || '');
    return response;
};
