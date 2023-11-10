import type { APIRoute, APIContext } from 'astro';
import { checkToken } from '@lib/auth';

export const POST: APIRoute = async ({ request }: APIContext) => {
    try {
        const authorizationHeader = request.headers.get('Authorization');
        if (!authorizationHeader) {
            return new Response(
                JSON.stringify({ error: 'Falta el encabezado Autorización' }),
                {
                    status: 401,
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
        }

        const token = authorizationHeader.replace('Bearer ', '');
        const isValid = await checkToken(token);

        return new Response(
            JSON.stringify({ valid: isValid }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('Error en la solicitud POST:', error);

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
