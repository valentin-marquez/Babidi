import type { APIRoute, APIContext } from 'astro';
import { checkToken } from '@lib/auth';

export const POST: APIRoute = async ({ request }: APIContext) => {
    try {
        const { access_token } = await request.json();

        const result = await checkToken(access_token);
        return new Response(
            JSON.stringify({ result }),
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
