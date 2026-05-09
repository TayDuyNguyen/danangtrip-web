import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types";

export interface ContactPayload {
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  /**
   * Submit a contact form or newsletter subscription.
   */
  submit: (payload: ContactPayload): Promise<ApiResponse<unknown>> =>
    axiosInstance.post(API_ENDPOINTS.CONTACTS, payload),
};
