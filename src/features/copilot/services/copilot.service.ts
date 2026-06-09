import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import type { RecommendedItem } from "../store/copilot.store";

export const copilotService = {
  processMessage: async (
    message: string,
    locale: string = "vi"
  ): Promise<{
    text: string;
    recommendations: RecommendedItem[];
    center?: [number, number];
    zoom?: number;
  }> => {
    const response = await api.post<{
      text: string;
      answer?: string;
      recommendations?: RecommendedItem[];
      center?: [number, number];
      zoom?: number;
    }>(API_ENDPOINTS.CHAT, {
      message,
      locale,
    });

    return {
      text: response.data?.text || response.data?.answer || "",
      recommendations: response.data?.recommendations || [],
      center: response.data?.center,
      zoom: response.data?.zoom,
    };
  }
};
