import { useState, useCallback } from "react";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { handleApiError } from "@renderer/shared/api/utils";
import { toastService } from "@shared/services";
import { ToastSeverity } from "@renderer/shared/enum/enum";
import { AxiosProgressEvent } from "axios";

export const useProfileSettings = () => {
  const { user, token, setAuth, updateUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateProfile = useCallback(
    async (name: string) => {
      if (!user || !token) return;

      setIsUpdating(true);
      try {
        const { data: updatedUser } = await userApi.updateProfile({ name });

        setAuth(updatedUser, token);

        toastService.show(
          ToastSeverity.SUCCESS,
          "Profile updated successfully",
        );
        return true;
      } catch (err) {
        handleApiError(err, "Failed to update profile");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, token, setAuth],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user || !token) {
        toastService.show(ToastSeverity.ERROR, "User not authenticated.");
        return;
      }

      setIsUpdating(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          );
          setUploadProgress(percentCompleted);
        };

        const { data: updatedUser } = await userApi.uploadAvatar(
          formData,
          onUploadProgress,
        );

        updateUser(updatedUser);

        toastService.show(ToastSeverity.SUCCESS, "Avatar updated successfully");
      } catch (err) {
        handleApiError(err, "Failed to upload avatar");
      } finally {
        setIsUpdating(false);
      }
    },
    [user, token, setAuth, updateUser],
  );

  return {
    user,
    isUpdating,
    uploadProgress,
    updateProfile,
    uploadAvatar,
  };
};
