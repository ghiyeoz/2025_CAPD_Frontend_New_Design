// src/api/places.ts
import { api } from "./client";

export interface SearchPlacesReq {
  lat: number;
  lng: number;
  radius: number;            // meters
  category?: string;
  q?: string;
}

export interface PlaceItem {
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  open_now?: boolean;
  distance_km?: number;
  address?: string;
  photo_url?: string;
}

export async function searchPlaces(params: SearchPlacesReq): Promise<PlaceItem[]> {
  const { data } = await api.get<PlaceItem[]>("/places", { params });
  return data;
}