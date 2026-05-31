"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { User, Phone, Calendar, MapPin, Camera, Loader2, Sparkles } from "lucide-react";
import { updateProfileSchema } from "../validators/profile.validator";
import type { UpdateProfileFormInput } from "../validators/profile.validator";
import type { User as UserEntity } from "@/types";
import { resolveMediaUrl } from "@/utils/media-url";

interface FormErrors {
  full_name?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  city?: string;
}

interface FocusState {
  full_name: boolean;
  phone: boolean;
  birthdate: boolean;
  gender: boolean;
  city: boolean;
}

const getProfileFormGender = (
  gender: UserEntity["gender"]
): UpdateProfileFormInput["gender"] => gender ?? "";

const formatDateForInput = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

interface ProfileEditFormProps {
  user: UserEntity;
  avatarPreview?: string | null;
  onSubmit: (data: UpdateProfileFormInput) => void;
  onAvatarUpload: (file: File) => void;
  isUpdatingProfile?: boolean;
  isUploadingAvatar?: boolean;
  apiError?: string | null;
}

export function ProfileEditForm({
  user,
  avatarPreview = null,
  onSubmit,
  onAvatarUpload,
  isUpdatingProfile = false,
  isUploadingAvatar = false,
  apiError,
}: ProfileEditFormProps) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  // Form Fields State initialized from user entity
  const [fields, setFields] = useState<UpdateProfileFormInput>({
    full_name: user.name || "",
    phone: user.phone || "",
    birthdate: formatDateForInput(user.birthdate),
    gender: getProfileFormGender(user.gender),
    city: user.city || "",
  });

  // Sync state with user store when it updates (especially after successful mutation)
  useEffect(() => {
    setFields({
      full_name: user.name || "",
      phone: user.phone || "",
      birthdate: formatDateForInput(user.birthdate),
      gender: getProfileFormGender(user.gender),
      city: user.city || "",
    });
  }, [user]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [focus, setFocus] = useState<FocusState>({
    full_name: false,
    phone: false,
    birthdate: false,
    gender: false,
    city: false,
  });
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = user.name || fields.full_name;
  const displayAvatar = avatarPreview ?? resolveMediaUrl(user.avatar);

  const genderOptions = useMemo<SelectOption[]>(
    () => [
      { value: "male", label: t("profile_edit.gender_male") },
      { value: "female", label: t("profile_edit.gender_female") },
      { value: "other", label: t("profile_edit.gender_other") },
      {
        value: "prefer_not_to_say",
        label: t("profile_edit.gender_prefer_not_to_say"),
      },
    ],
    [t]
  );

  const selectedGender =
    genderOptions.find((option) => option.value === fields.gender) ?? null;

  const handleChange = useCallback(
    (field: keyof UpdateProfileFormInput) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFields((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error on change
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  const handleFocus = useCallback(
    (field: keyof FocusState) => () =>
      setFocus((prev) => ({ ...prev, [field]: true })),
    []
  );

  const handleBlur = useCallback(
    (field: keyof FocusState) => () =>
      setFocus((prev) => ({ ...prev, [field]: false })),
    []
  );

  const handleReset = () => {
    setFields({
      full_name: user.name || "",
      phone: user.phone || "",
      birthdate: formatDateForInput(user.birthdate),
      gender: getProfileFormGender(user.gender),
      city: user.city || "",
    });
    setErrors({});
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = updateProfileSchema.safeParse(fields);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = fields.full_name.trim().length > 0;
  const showAvatarImage = Boolean(displayAvatar) && failedAvatarUrl !== displayAvatar;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 rounded-[28px] border border-border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] duration-500 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4 border-b border-border pb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-on-surface">
            {t("profile_edit.heading")}
          </h2>
          <p className="mt-0.5 text-sm text-on-surface-subtle">
            {t("profile_edit.description")}
          </p>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="mb-8 flex flex-col items-center gap-6 border-b border-border pb-8 sm:flex-row">
        <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-[#fafafa] text-4xl font-bold transition-all duration-300 hover:border-primary">
            {isUploadingAvatar && !avatarPreview ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : showAvatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setFailedAvatarUrl(displayAvatar ?? null)}
              />
            ) : (
              <span className="select-none text-on-surface">
                {displayName?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            disabled={isUploadingAvatar}
          />
        </div>

        <div className="text-center sm:text-left">
          <h3 className="mb-1 text-sm font-semibold text-on-surface">
            {t("profile_edit.avatar_heading")}
          </h3>
          <p className="max-w-[240px] text-xs text-on-surface-subtle">
            {t("profile_edit.avatar_description")}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 py-1.5 px-3 text-xs"
            onClick={triggerFileSelect}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? tCommon("common.loading") : t("profile_edit.avatar_heading")}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
        {/* Full Name */}
        <Input
          id="full-name"
          label={t("profile_edit.full_name_label")}
          placeholder={t("profile_edit.full_name_placeholder")}
          value={fields.full_name}
          onChange={handleChange("full_name")}
          onFocus={handleFocus("full_name")}
          onBlur={handleBlur("full_name")}
          isFocused={focus.full_name}
          error={errors.full_name}
          leftIcon={<User className="w-4 h-4" />}
          persistentLabel
          disabled={isUpdatingProfile}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <Input
            id="phone"
            label={t("profile_edit.phone_label")}
            placeholder={t("profile_edit.phone_placeholder")}
            value={fields.phone || ""}
            onChange={handleChange("phone")}
            onFocus={handleFocus("phone")}
            onBlur={handleBlur("phone")}
            isFocused={focus.phone}
            error={errors.phone}
            leftIcon={<Phone className="w-4 h-4" />}
            persistentLabel
            disabled={isUpdatingProfile}
          />

          {/* Date of birth */}
          <Input
            id="birthdate"
            label={t("profile_edit.birthdate_label")}
            placeholder={t("profile_edit.birthdate_placeholder")}
            type="date"
            value={fields.birthdate || ""}
            onChange={handleChange("birthdate")}
            onFocus={handleFocus("birthdate")}
            onBlur={handleBlur("birthdate")}
            isFocused={focus.birthdate}
            error={errors.birthdate}
            leftIcon={<Calendar className="w-4 h-4" />}
            persistentLabel
            disabled={isUpdatingProfile}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            instanceId="profile-gender"
            label={t("profile_edit.gender_label")}
            placeholder={tCommon("common.select_placeholder")}
            options={genderOptions}
            value={selectedGender}
            onChange={(option) => {
              const next = option?.value ?? "";
              setFields((prev) => ({ ...prev, gender: String(next) as UpdateProfileFormInput["gender"] }));
              if (errors.gender) {
                setErrors((prev) => ({ ...prev, gender: undefined }));
              }
            }}
            onFocus={() => setFocus((prev) => ({ ...prev, gender: true }))}
            onBlur={() => setFocus((prev) => ({ ...prev, gender: false }))}
            isFocused={focus.gender}
            persistentLabel
            isDisabled={isUpdatingProfile}
            isClearable
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
          />

          {/* City / Location */}
          <Input
            id="city"
            label={t("profile_edit.city_label")}
            placeholder={t("profile_edit.city_placeholder")}
            value={fields.city || ""}
            onChange={handleChange("city")}
            onFocus={handleFocus("city")}
            onBlur={handleBlur("city")}
            isFocused={focus.city}
            error={errors.city}
            leftIcon={<MapPin className="w-4 h-4" />}
            persistentLabel
            disabled={isUpdatingProfile}
          />
        </div>

        {apiError && (
          <p className="text-sm text-red-500 animate-in fade-in duration-300">
            {apiError}
          </p>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isUpdatingProfile}
          >
            {t("profile_edit.cancel_button")}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto sm:ml-auto"
            isLoading={isUpdatingProfile}
            disabled={!isFormValid || isUpdatingProfile}
            id="profile-edit-submit"
          >
            {t("profile_edit.submit_button")}
          </Button>
        </div>
      </form>
    </div>
  );
}
