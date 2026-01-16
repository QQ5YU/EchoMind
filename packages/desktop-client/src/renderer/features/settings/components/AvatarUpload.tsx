import React, { useState, useEffect } from "react";
import { useAuthStore, userApi } from "@entities/user";
import { ProfileAvatar } from "@pages/Profile/ui/ProfileAvatar";

export const AvatarUpload: React.FC = () => {
  const { user, avatarUrl } = useAuthStore();

  const getInitials = (
    displayName: string | undefined,
    userEmail: string | undefined
  ) => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return userEmail?.slice(0, 2).toUpperCase() || "??";
  };


  return (
    <div className="flex flex-col items-center gap-4 p-4 mb-4 rounded-lg bg-surface-card">
      <h3 className="text-xl font-semibold text-color-secondary">
        Profile Picture
      </h3>

      <ProfileAvatar
        label={getInitials(user?.name, user?.email)}
      />

      <input
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
      />

      <p className="text-sm text-color-secondary">JPG or PNG, max 5MB</p>
    </div>
  );
};
