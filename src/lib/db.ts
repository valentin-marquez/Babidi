import { prisma } from '@lib/prisma-client';
import { supabase } from '@lib/supabase-client'



async function updateUserLocation(user_id: string, latitude: number, longitude: number) {
    const { data, error } = await supabase.rpc('update_user_location', { user_id: user_id, latitude: latitude, longitude: longitude })
    if (error) {
        console.error(error)
        return null
    }
    return data
}