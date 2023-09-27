import { Resend } from "resend";

export const resend = new Resend(import.meta.env.SENDER_KEY);

