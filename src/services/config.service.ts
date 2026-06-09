import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import type { ApiResponse, Config } from "@/types";
import { getApiErrorMessage } from "@/utils/api-error";

export interface ApiConfigData {
  general?: {
    hotline?: string;
    email?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  payment?: {
    sepay?: boolean;
    payos?: boolean;
    cod?: boolean;
    vnpay?: boolean;
    momo?: boolean;
    zalopay?: boolean;
  };
  brand?: {
    website_name?: string;
    logo?: string;
    favicon?: string;
  };
  policy?: {
    terms?: string;
    privacy?: string;
    data_protection?: string;
  };
}

/**
 * Reusable utility to map raw API configuration response to the flat Config interface.
 */
export const mapApiConfig = (apiData: ApiConfigData): Config => {
  return {
    hotline: apiData.general?.hotline || "",
    email: apiData.general?.email || "",
    address: apiData.general?.address || "",
    social_links: {
      facebook: apiData.social?.facebook || "",
      instagram: apiData.social?.instagram || "",
      youtube: apiData.social?.youtube || "",
      twitter: apiData.social?.twitter || apiData.social?.facebook || "",
      website: apiData.social?.website || apiData.social?.facebook || "",
    },
    payment: {
      sepay: (apiData.payment?.sepay ?? apiData.payment?.payos) !== false, // default true
      payos: (apiData.payment?.sepay ?? apiData.payment?.payos) !== false, // legacy alias
      cod: apiData.payment?.cod !== false,     // default true
      vnpay: !!apiData.payment?.vnpay,
      momo: !!apiData.payment?.momo,
      zalopay: !!apiData.payment?.zalopay,
    },
    brand: {
      website_name: apiData.brand?.website_name || "",
      logo: apiData.brand?.logo || "",
      favicon: apiData.brand?.favicon || "",
    },
    policy: {
      terms: apiData.policy?.terms || "",
      privacy: apiData.policy?.privacy || "",
      data_protection: apiData.policy?.data_protection || "",
    }
  };
};

export const getAppConfig = async (): Promise<Config | undefined> => {
  try {
    const response = await axiosInstance.get<ApiConfigData>(API_ENDPOINTS.CONFIG);
    const apiData = response.data;
    if (!apiData) return undefined;

    return mapApiConfig(apiData);
  } catch (error) {
    if (!axios.isCancel(error)) {
      const apiError = error as ApiResponse | undefined;
      console.warn("Failed to fetch app config", {
        message: getApiErrorMessage(error, "Failed to fetch app config"),
        status: apiError?.status,
        code: apiError?.code,
        error_key: apiError?.error_key,
      });
    }
    return undefined;
  }
};
