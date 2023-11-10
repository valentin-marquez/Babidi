import type { APIRoute, APIContext } from 'astro';
import { checkToken } from '@lib/auth';

export function TokenVerification(endpoint: APIRoute): APIRoute {
    return async (context: APIContext) => {
        try {
            const { request } = context;
            const authorizationHeader = (request.headers?.get('Authorization'));
            if (!authorizationHeader) {
                return new Response(
                    JSON.stringify({ error: 'Missing Authorization header' }),
                    {
                        status: 401,
                        statusText: 'Missing Authorization header',
                        headers: {
                            'content-type': 'application/json'
                        }
                    }
                );
            }

            const isValidToken = await checkToken(authorizationHeader);

            if (!isValidToken) {
                return new Response(
                    JSON.stringify({ error: 'Invalid token' }),
                    {
                        status: 401,
                        headers: {
                            'content-type': 'application/json'
                        }
                    }
                );
            }
            return await endpoint(context);
        } catch (error) {
            console.error('Error en la solicitud Validador de token:', error);

            return new Response(
                JSON.stringify({ error: 'Internal Server Error' }),
                {
                    status: 500,
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            );
        }
    };
}
