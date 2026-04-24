import { API_ENDPOINTS } from "@/config";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types";

export type UploadedImageMeta = {
  url: string;
  public_id?: string | null;
  asset_id?: string | null;
};

/**
 * POST /upload/images (auth). Used when the flow uploads to Cloudinary before persisting URLs elsewhere.
 */
export const uploadService = {
  uploadImages: (files: File[], folder?: string): Promise<ApiResponse<UploadedImageMeta[]>> => {
    const fd = new FormData();
    files.forEach((file) => {
      fd.append("images[]", file);
    });
    if (folder?.trim()) {
      fd.append("folder", folder.trim());
    }
    return axiosInstance.post(API_ENDPOINTS.UPLOAD.IMAGES, fd);
  },
};
