import { supabase } from "@lib/supabase-client";
import { v4 as uuidv4 } from "uuid";
import type { VerifyEmailOtpParams } from "@supabase/supabase-js";
import type { Profile, UserLocation } from "@lib/interfaces";
import type { User } from "@supabase/supabase-js";

export async function getUser(token: string): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return data ? data.user : null;
}

export async function UserExists(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);
  if (error) throw error;
  return data.length > 0;
}

export async function signUpEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: import.meta.env.DEV
        ? "http://localhost:4321/verify"
        : "https://babidi.vercel.app/verify",
    },
  });
  let authError = null;

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    authError = {
      name: "AuthError",
      message: "Email already Exists",
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }
  return { auth: data, error: authError };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { auth: data, error: error };
}

export async function signInWithGoogle(redirectUrl?: string) {
  let redirectTo;
  if (redirectUrl) {
    redirectTo =
      (import.meta.env.DEV
        ? "http://localhost:4321/verify"
        : "https://babidi.vercel.app/verify") +
      "?redirect=" +
      redirectUrl;
  } else {
    redirectTo = import.meta.env.DEV
      ? "http://localhost:4321/verify"
      : "https://babidi.vercel.app/verify";
  }

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo,
    },
  });
}

export async function verifyCode(email: string, code: string) {
  const credentials: VerifyEmailOtpParams = {
    email: email,
    token: code,
    type: "email",
  };
  const { data, error } = await supabase.auth.verifyOtp(credentials);
  if (error) throw error;
  return data;
}

export async function setSessionData(
  refreshToken: string,
  accessToken: string,
) {
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;
  return data;
}

export async function checkToken(token: string): Promise<boolean> {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return !!data;
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
    };
    const { error } = await supabase.from("profiles").insert([profile_data]);

    if (error) {
      console.error(error);
      return false;
    }

    if (user.geometry.latitude && user.geometry.longitude) {
      const location: UserLocation = {
        id: user.id,
        latitude: user.geometry.latitude,
        longitude: user.geometry.longitude,
      };
      await fetch("/api/user/updateLocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify(location),
      });
    }

    const response = await fetch("/api/user/setOnboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${user.token}`,
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

export async function uploadImage(
  image: File,
): Promise<{ url: string; file_id: string }> {
  const file_id = uuidv4();
  const storage = supabase.storage.from("post_images");
  const { data, error } = await storage.upload(`${file_id}`, image);
  if (error) throw error;
  const publicURL = storage.getPublicUrl(`${file_id}`).data.publicUrl;
  return { url: publicURL, file_id: data.path };
}

export async function uploadAvatar(
  image: File,
  user_id: string,
): Promise<{ url: string; file_id: string }> {
  const file_id = uuidv4();
  const storage = supabase.storage.from("avatars");
  const { data, error } = await storage.upload(`${user_id}/${file_id}`, image);
  if (error) throw error;
  const publicURL = storage.getPublicUrl(`${data.path}`).data.publicUrl;
  return { url: publicURL, file_id: file_id };
}

export async function isLoggedIn(sbat: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser(sbat);

  if (!user || user.role !== "authenticated") return false;

  return true;
}

export async function isSameUser(
  sbat: string,
  user_id: string,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser(sbat);
  if (!user || user.id !== user_id) return false;
  return true;
}

export async function deleteAvatar(file_path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from("avatars")
    .remove([`${file_path}`]);
  if (error) throw error;
  return true;
}

export interface ReceiverUser {
  user_id: string;
  full_name: string;
  username: string;
  avatar: string;
  bio: string;
}

export async function getUserByUsername(
  username: string,
): Promise<ReceiverUser | null> {
  const { data, error }: { data: ReceiverUser } = await supabase
    .from("profiles")
    .select("user_id, full_name, username, avatar, bio")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
}
