import type { APIRoute, APIContext } from 'astro';
import { checkToken, setSessionData } from '@lib/auth';

export const POST: APIRoute = async ({ request }: APIContext) => {
    try {
        const { access_token, refresh_token } = await request.json();

        const result = await checkToken(access_token);

        if (result) {
            await setSessionData(refresh_token, access_token);
        }

        return {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ result })
        };
    } catch (error) {
        console.error('Error en la solicitud POST:', error);

        return {
            status: 500,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
