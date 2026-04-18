import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config";
import type { Config } from "@/types";

export const getAppConfig = async () => {
  try {
    const response = await api.get<Config>(API_ENDPOINTS.CONFIG);
    return response.data;
  } catch {
    // Silent fallback
    return {
      hotline: "1900 1234",
      email: "contact@danangtrip.vn",
      address: "254 Nguyễn Văn Linh, Đà Nẵng",
      social_links: {
        facebook: "https://facebook.com/danangtrip",
        instagram: "https://instagram.com/danangtrip",
        twitter: "https://twitter.com/danangtrip",
      },
    } as Config;
  }
};
