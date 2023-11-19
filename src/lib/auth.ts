import { supabase } from "@lib/supabase-client";
import type { VerifyEmailOtpParams } from "@supabase/supabase-js";

import type { Profile, UserLocation } from "@lib/interfaces";
import type { User } from "@supabase/supabase-js";
export async function getUser(token: string): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return data ? data.user : null;
}

export async function UserExists(email: string) {
    const { data, error } = await supabase.from('users').select('id').eq('email', email);
    if (error) throw error;
    return data.length > 0;
}

export async function signUpEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: "http://localhost:4321/verify",
        }
    })
    let authError = null;

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        authError = {
            name: "AuthError",
            message: "Email already Exists"
        };
    } else if (error) {
        authError = {
            name: error.name,
            message: error.message
        }
    }
    return { auth: data, error: authError };
}

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    return { auth: data, error: error };
}

export async function signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: "http://localhost:4321/verify"
        }
    })
}

export async function verifyCode(email: string, code: string) {
    const credentials: VerifyEmailOtpParams = {
        email: email,
        token: code,
        type: 'email',
    }
    const { data, error } = await supabase.auth.verifyOtp(credentials)
    if (error) throw error;
    return data;
}

export async function setSessionData(refreshToken: string, accessToken: string) {
    const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error) throw error;
    return data;
}

export async function checkToken(token: string): Promise<boolean> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return !!data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function CreateUserProfile(user: Profile): Promise<boolean> {
    try {
        const profile_data = {
            user_id: user.id,
            full_name: user.fullName,
            username: user.username,
            accepted_terms: user.accepted_terms,
            is_adult: user.is_adult,
            avatar: user.avatar,
            bio: user.bio,
            status: user.status,
        }
        const { error } = await supabase
            .from('profiles')
            .insert([profile_data])

        if (error) {
            console.error(error);
            return false;
        }

        if (user.geometry.latitude && user.geometry.longitude) {
            const location: UserLocation = {
                id: user.id,
                latitude: user.geometry.latitude,
                longitude: user.geometry.longitude,
            }
            const response = await fetch("/api/user/updateLocation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                },
                credentials: "same-origin",
                body: JSON.stringify(location),
            });
        }

        const response = await fetch("/api/user/setOnboarding", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${user.token}`,
            },
            credentials: "same-origin",
            body: JSON.stringify({ userId: user.id, isOnboarding: false }),
        });

        if (!response.ok) {
            console.error(response.statusText);
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}