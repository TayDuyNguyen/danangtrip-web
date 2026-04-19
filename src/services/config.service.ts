import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { Config } from "@/types";

export const getAppConfig = async (): Promise<Config | undefined> => {
  const response = await api.get<Config>(API_ENDPOINTS.CONFIG);
  return response.data;
};
