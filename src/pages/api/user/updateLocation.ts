import type { APIRoute, APIContext } from 'astro';
import { TokenVerification } from '@lib/decorators'
import { updateUserLocation } from '@lib/db';


export const POST: APIRoute = TokenVerification(async ({ request }: APIContext) => {
    try {
        const { id, latitude, longitude } = await request.json();
        const updated = await updateUserLocation({ id, latitude, longitude });
        console.log(id, latitude, longitude)
        console.log(updated)
        if (updated) {
            return new Response(
                JSON.stringify({ success: true }),
                {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            )
        } else {
            return new Response(
                JSON.stringify({ success: false }),
                {
                    status: 400,
                    statusText: 'Bad Request',
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