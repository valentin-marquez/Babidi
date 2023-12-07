import { supabase } from "@lib/supabase-client";

export interface Message {
  message_id: number;
  sender_id: string;
  receiver_id: string;
  post_id: number;
  content: string;
  timestamp: string;
  status: string;
  attachment_id: number;
  reply_to: number;
}
export interface UserInfo {
  user_id: string;
  full_name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
}

// Fetch messages for a specific user from the database
export async function getMessages(
  userId: string,
  receiverId?: string,
): Promise<Message[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .order("timestamp", { ascending: true });

  if (receiverId) {
    query = query.or(
      `sender_id.eq.${userId},receiver_id.eq.${receiverId}, sender_id.eq.${receiverId},receiver_id.eq.${userId}`,
    );
  } else {
    query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  }

  const { data: messages, error } = await query;

  if (error) throw error;

  console.log(messages);
  return messages || [];
}

// Send a message
export async function sendMessage(
  content: string,
  sender_id: string,
  receiver_id: string,
): Promise<void> {
  const { error } = await supabase.from("messages").insert([
    {
      content,
      sender_id,
      receiver_id,
      timestamp: new Date(),
      status: "sent",
    },
  ]);

  if (error) throw error;
}

// Update message status
export async function updateMessageStatus(
  message_id: number,
  status: string,
): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ status })
    .match({ message_id });

  if (error) throw error;
}

export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  const { data: user, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, username, avatar, bio")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return user || null;
}

export async function getUserChats(userId: string): Promise<string[]> {
  const { data: chats, error } = await supabase
    .from("messages")
    .select("receiver_id")
    .eq("sender_id", userId);

  if (error) throw error;

  const uniqueReceiverIds = Array.from(
    new Set(chats?.map((chat) => chat.receiver_id)),
  );
  return uniqueReceiverIds || [];
}
