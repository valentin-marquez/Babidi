import { prisma } from '@lib/prisma-client';
import { supabase } from '@lib/supabase-client'
import type { UserLocation } from '@lib/interfaces';



export async function updateUserLocation(userLocation: UserLocation): Promise<Boolean> {
    const { error } = await supabase.rpc('update_user_location', { userid: userLocation.id, longitude: userLocation.longitude, latitude: userLocation.latitude })
    if (error) {
        console.error(error)
        return false
    }
    return true
}

export async function getIsOnboarding(userId: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            is_onboarding: true
        }
    })
    return user.is_onboarding
}

export async function setIsOnboarding(userId: string, isOnboarding: boolean): Promise<boolean> {
    const user = await prisma.users.update({
        where: {
            id: userId
        },
        data: {
            is_onboarding: isOnboarding
        }
    })
    console.log(user)
    return user.is_onboarding
}