"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea, Button } from "@/components/ui";
import { IoArrowForwardOutline } from "@/components/icons/solar";
import { useContactSubmit } from "../hooks/use-contact";
import { contactSchema, type ContactInput } from "../validators/contact.validator";

export const ContactForm = () => {
  const t = useTranslations("contact");
  const { mutate: submitForm, isPending: isLoading } = useContactSubmit();
  
  const [formData, setFormData] = useState<ContactInput>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const handleChange = (field: keyof ContactInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Manual validation using Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[path]) {
          fieldErrors[path] = t(`validation.${issue.message}`);
        }
      });
      setErrors(fieldErrors);
      return;
    }

    submitForm(formData, {
      onSuccess: () => {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="reveal-up rounded-[28px] border border-border bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-on-surface lg:text-3xl">
          {t("success.title")}
        </h2>
        <p className="mx-auto mb-8 max-w-md font-medium leading-relaxed text-on-surface-subtle">
          {t("success.message")}
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="secondary"
          className="rounded-full px-8"
        >
          {t("form.submit_another")}
        </Button>
      </div>
    );
  }

  return (
    <div className="reveal-up reveal-delay-300 rounded-[28px] border border-border bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
      <div className="mb-10">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-on-surface lg:text-3xl">
          {t("form.title")}
        </h2>
        <p className="font-medium leading-relaxed text-on-surface-subtle">
          {t("form.subtitle")}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t("form.name")}
            placeholder={t("form.name_placeholder")}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
            isFocused={focusedField === "name"}
            disabled={isLoading}
            required
          />
          <Input
            label={t("form.email")}
            type="email"
            placeholder={t("form.email_placeholder")}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            isFocused={focusedField === "email"}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t("form.phone")}
            placeholder={t("form.phone_placeholder")}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            onFocus={() => handleFocus("phone")}
            onBlur={handleBlur}
            isFocused={focusedField === "phone"}
            disabled={isLoading}
          />
          <Input
            label={t("form.subject")}
            placeholder={t("form.subject_placeholder")}
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            error={errors.subject}
            onFocus={() => handleFocus("subject")}
            onBlur={handleBlur}
            isFocused={focusedField === "subject"}
            disabled={isLoading}
          />
        </div>

        <Textarea
          label={t("form.message")}
          placeholder={t("form.message_placeholder")}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          error={errors.message}
          onFocus={() => handleFocus("message")}
          onBlur={handleBlur}
          isFocused={focusedField === "message"}
          rows={5}
          disabled={isLoading}
          required
        />

        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="h-14 w-full min-w-[200px] rounded-full bg-primary text-white transition-all duration-300 hover:bg-primary-hover sm:w-auto"
            isLoading={isLoading}
          >
            {isLoading ? t("form.submitting") : t("form.submit")}
            {!isLoading && <IoArrowForwardOutline className="w-5 h-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
