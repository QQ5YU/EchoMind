import { userApi } from "../api/userApi";
import { useState, useEffect } from "react";

export const useAvatarImage = (avatarPath?: string | null) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarPath) {
      setBlobUrl(null);
      return;
    }

    let active = true;
    let url: string;

    userApi
      .getAvatar(avatarPath)
      .then((response) => {
        if (active) {
          url = URL.createObjectURL(response.data);
          setBlobUrl(url);
        }
      })
      .catch((error) => {
        console.error("Failed to load avatar:", error);
      });

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [avatarPath]);

  return blobUrl;
};
