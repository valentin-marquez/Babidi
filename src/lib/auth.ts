import cookie from "cookie";
import { supabase } from "@lib/supabase-client";
import type { VerifyEmailOtpParams } from "@supabase/supabase-js";


export async function getUser(req: Request) {
    const cookies = cookie.parse(req.headers.get("Cookie") ?? "");
    if (!cookies.sb_session) return null;

    const { data: { user } } = await supabase.auth.getUser(cookies.sb_session);
    if (!user || user.role !== "authenticated") return null;
    return user;
}


export async function isLoggedIn(req: Request) {
    const user = await getUser(req);
    return !!user;
}


export async function UserExists(email: string) {
    const { data, error } = await supabase.from('users').select('id').eq('email', email);
    if (error) throw error;
    return data.length > 0;
}

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: "http://localhost:4321/verify",
            data: {
                onboarding: false,
                profile: {
                    username: null,
                    first_name: null,
                    last_name: null,
                    city: null,
                    bio: null,
                }
            }
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

export async function signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ email: email })
    console.log(data)
    return data;
}

export async function signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({ provider: 'google' })
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
    if (error) {
        return false;
    }
    return true;
}