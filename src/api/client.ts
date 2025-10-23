// src/api/client.ts
import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_API_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});
