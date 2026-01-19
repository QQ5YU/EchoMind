import { useState, useCallback } from "react";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { handleApiError } from "@renderer/shared/api/utils";
import { toastService } from "@renderer/shared/services/toast-notification.service";
import { ToastSeverity } from "@renderer/shared/enum/enum";

export const useProfile = () => {
  const { user, token, setAuth, updateUser, clearAvatarBlobUrl } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = useCallback(async (name: string) => {
    if (!user || !token) return;

    setIsUpdating(true);
    try {
      const { data: updatedUser } = await userApi.updateProfile({ name });
      
      setAuth(updatedUser, token);
      
      toastService.show(ToastSeverity.SUCCESS, "Profile updated successfully");
      return true;
    } catch (err) {
      handleApiError(err, "Failed to update profile");
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user, token, setAuth]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user || !token) {
      toastService.show(ToastSeverity.ERROR, "User not authenticated.");
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: updatedUser } = await userApi.uploadAvatar(formData);
      
      updateUser(updatedUser);
      clearAvatarBlobUrl();
      
      toastService.show(ToastSeverity.SUCCESS, "Avatar updated successfully");
    } catch (err) {
      handleApiError(err, "Failed to upload avatar");
    } finally {
      setIsUpdating(false);
    }
  }, [user, token, updateUser, clearAvatarBlobUrl]);


  return {
    user,
    isUpdating,
    updateProfile,
    uploadAvatar,
  };
};
