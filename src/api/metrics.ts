// src/api/metrics.ts
import { api } from "./client";

/** 🔢 일별 온도 시리즈 */
export async function getDailyTemperature(): Promise<{ labels: string[]; values: number[] }> {
  const { data } = await api.get("/metrics/daily");
  // FastAPI’dan: { labels: [...], values: [...] } qaytadi deb hisoblaymiz
  return data;
}