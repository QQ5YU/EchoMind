import React from "react";
import { getInitials, useAvatarImage } from "@entities/user";
import { UserAvatar } from "@entities/user/ui";
import { useProfileSettings } from "../hooks";

export const AvatarUpload: React.FC = () => {
  const { user, isUpdating, uploadProgress, uploadAvatar } =
    useProfileSettings();

  const displayImage = useAvatarImage(user?.avatarUrl);

  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="flex flex-col items-center gap-4  rounded-lg bg-surface-card">
      <h3 className="text-xl font-semibold text-color-secondary">
        Profile Picture
      </h3>

      <UserAvatar
        label={initials}
        image={displayImage ?? undefined}
        onChange={uploadAvatar}
        isUploading={isUpdating}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};
