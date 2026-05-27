"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ProfileEditForm } from "./ProfileEditForm";
import { useProfileUpdateMutation } from "../hooks/useProfileUpdateMutation";
import { useProfileAvatarMutation } from "../hooks/useProfileAvatarMutation";
import { useAuthStore } from "@/store/auth.store";
import type { UpdateProfileFormInput } from "../validators/profile.validator";
import { getApiErrorMessage } from "@/utils/api-error";
import { normalizeAuthUser } from "@/utils/normalize-user";

/**
 * Container component for profile edit form.
 * Links user data, profile update mutation, and avatar upload mutation.
 */
export function ProfileEditFormContainer() {
  const t = useTranslations("settings");
  const { user, setUser, updateUser } = useAuthStore();
  const { updateProfile } = useProfileUpdateMutation();
  const { updateAvatar } = useProfileAvatarMutation();

  const [apiError, setApiError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const previousAvatarRef = useRef<string | undefined>(undefined);

  const clearAvatarPreview = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setAvatarPreview(null);
  };

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const normalized = normalizeAuthUser(user);
    if (
      normalized.name !== user.name ||
      normalized.avatar !== user.avatar
    ) {
      setUser(normalized);
    }
  }, [user, setUser]);

  if (!user) return null;

  const handleProfileSubmit = (data: UpdateProfileFormInput) => {
    setApiError(null);

    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success(t("profile_edit.success_toast"), {
          id: "profile-update-success",
        });
      },
      onError: (error) => {
        const message = getApiErrorMessage(error);
        setApiError(message || t("profile_edit.error_generic"));
        toast.error(t("profile_edit.error_generic"), {
          id: "profile-update-error",
        });
      },
    });
  };

  const handleAvatarUpload = (file: File) => {
    // Basic file validation
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeBytes) {
      toast.error(t("profile_edit.avatar_description"));
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("profile_edit.avatar_description"));
      return;
    }

    clearAvatarPreview();
    const previewUrl = URL.createObjectURL(file);
    previewRef.current = previewUrl;
    previousAvatarRef.current = user.avatar;
    setAvatarPreview(previewUrl);
    updateUser({ avatar: previewUrl });

    updateAvatar.mutate(file, {
      onSuccess: () => {
        clearAvatarPreview();
        previousAvatarRef.current = undefined;
        toast.success(t("profile_edit.avatar_upload_success"), {
          id: "avatar-upload-success",
        });
      },
      onError: () => {
        updateUser({ avatar: previousAvatarRef.current });
        previousAvatarRef.current = undefined;
        clearAvatarPreview();
        toast.error(t("profile_edit.avatar_upload_error"), {
          id: "avatar-upload-error",
        });
      },
    });
  };

  return (
    <ProfileEditForm
      user={user}
      avatarPreview={avatarPreview}
      onSubmit={handleProfileSubmit}
      onAvatarUpload={handleAvatarUpload}
      isUpdatingProfile={updateProfile.isPending}
      isUploadingAvatar={updateAvatar.isPending}
      apiError={apiError}
    />
  );
}
