import type { APIRoute, APIContext } from 'astro';
import { checkToken, getUser } from '@lib/auth';
import { TokenVerification } from '@lib/decorators'


export const POST: APIRoute = TokenVerification(async ({ request }: APIContext) => {
    try {
        const token = request.headers.get('Authorization')
        const user = await getUser(token);
        if (user) {
            return new Response(
                JSON.stringify({ user }),
                {
                    status: 200,
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
        } else {
            return new Response(
                JSON.stringify({ error: 'Usuario no encontrado' }),
                {
                    status: 404,
                    statusText: 'Usuario no encontrado',
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
        }
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
})