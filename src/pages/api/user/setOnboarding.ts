import type { APIRoute, APIContext } from 'astro';
import { TokenVerification } from '@lib/decorators';
import { setIsOnboarding } from '@lib/db';


export const POST: APIRoute = TokenVerification(async ({ request }: APIContext) => {
    /**
     * Este enpoint es para actualizar el estado de is_onboarding de un usuario, ya que cuando es true significa que el usuario esta en el proceso de registro y cuando es false significa que el usuario ya termino el proceso de registro
     * 
     * @param {string} id - id del usuario
     * @param {boolean} isOnboarding - estado de is_onboarding del usuario
     * @returns {boolean} - true si se actualizo correctamente, false si no se actualizo
     * 
    */
    try {
        const { userId, isOnboarding } = await request.json();
        const updated = await setIsOnboarding(userId, isOnboarding);
        if (!updated) {
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