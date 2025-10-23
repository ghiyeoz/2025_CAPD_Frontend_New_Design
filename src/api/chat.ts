// src/api/chat.ts
import { api } from "./client";

export type ChatMode = "friendly" | "honest" | "realistic";

export async function startChat(payload: { mode: ChatMode }) {
  const { data } = await api.post<{ session_id: string }>("/chat/start", {
    mode: payload.mode,
  });
  return data;
}

export async function sendMessage(payload: {
  session_id: string;
  role: "user" | "bot";
  text?: string;
  image_url?: string;
}) {
  const { data } = await api.post<{ reply: string }>("/chat/send", payload);
  return data;
}