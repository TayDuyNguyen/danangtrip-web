import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { ApiResponse, Contact } from "@/types";
import type { ContactInput } from "@/features/contact/validators/contact.validator";

/**
 * Service for handling contact-related API calls
 */
export const contactService = {
  /**
   * Submit the contact form
   * @param data Contact form data validated by Zod
   */
  submit: async (data: ContactInput): Promise<ApiResponse<Contact>> => {
    return axiosInstance.post(API_ENDPOINTS.CONTACTS, data);
  },
};
