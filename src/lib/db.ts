import { prisma } from '@lib/prisma-client';
import { supabase } from '@lib/supabase-client'
import type { UserLocation } from '@lib/interfaces';



export async function updateUserLocation(userLocation: UserLocation): Promise<UserLocation | null> {
    const { error } = await supabase.rpc('update_user_location', { user_id: userLocation.id, latitude: userLocation.latitude, longitude: userLocation.longitude })
    if (error) {
        console.error(error)
        return null
    }
}

