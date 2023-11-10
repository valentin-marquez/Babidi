import type { APIRoute, APIContext } from 'astro';
import { TokenVerification } from '@lib/decorators';
import { getIsOnboarding } from '@lib/db';


export const POST: APIRoute = TokenVerification(async ({ request }: APIContext) => {
    /**
     * Este enpoint es para revisar si el estado de is_onboarding de un usuario, ya que cuando es true significa que el usuario esta en el proceso de registro y cuando es false significa que el usuario ya termino el proceso de registro
     * 
     * @param {string} id - id del usuario
     * @returns {boolean} - true si se actualizo correctamente, false si no se actualizo
     * 
    */
    try {
        const { id } = await request.json();
        const isOnboarding = await getIsOnboarding(id);
        return new Response(
            JSON.stringify({ status: isOnboarding }),
            {
                status: 200,
                statusText: 'OK',
                headers: {
                    'content-type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('Error en la solicitud POST isonboarding:', error);

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