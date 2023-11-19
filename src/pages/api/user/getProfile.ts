import type { APIRoute, } from 'astro';
import { getProfileInfo } from '@lib/db';

export const GET: APIRoute = async ({ params, request }: APIContext) => {
    try {
        const id: string = params.id;
        const user = await getProfileInfo(id);
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
}