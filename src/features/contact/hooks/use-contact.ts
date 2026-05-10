import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { ApiResponse } from "@/types";
import { contactSchema, type ContactInput } from "../validators/contact.validator";

/**
 * Hook for handling contact form submission
 */
export const useContactSubmit = () => {
  const t = useTranslations("contact");

  return useMutation({
    mutationFn: (data: ContactInput) => contactService.submit(data),
    onSuccess: (response: ApiResponse) => {
      if (response.success) {
        toast.success(t("success.message"));
      }
    },
    onError: (error: unknown) => {
      // Axios interceptor handles 500+, but we might want custom handling for 422
      const message = error instanceof Error ? error.message : t("error.message");
      toast.error(message);
    },
  });
};
