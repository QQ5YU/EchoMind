import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@shared/ui/Layout";
import { Sidebar } from "@widgets/Sidebar";
import { UserMenu } from "@widgets/UserMenu";
import { Toast } from "primereact/toast";
import { ProfileAvatar } from "./ui/ProfileAvatar";
import { ProfileForm } from "./ui/ProfileForm";
import { useProfile } from "./hooks/useProfile";
import { userApi } from "@entities/user/api/userApi";
import { useAuthStore } from "@entities/user/model/store";

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, uploadAvatar } = useProfile();
  const { avatarBlobUrl, setAvatarBlobUrl } = useAuthStore();
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }

    let objectUrl: string;
    if (user?.id && user.avatarPath && !avatarBlobUrl) {
      userApi
        .getAvatar(user.id)
        .then((response) => {
          objectUrl = URL.createObjectURL(response.data);
          setAvatarBlobUrl(objectUrl);
        })
        .catch((error) => {
          console.error("Failed to load avatar:", error);
        });
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user, avatarBlobUrl, setAvatarBlobUrl]);

  const handleSave = async () => {
    await updateProfile(name);
  };

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
    <Layout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <Toast ref={toast} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Account Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-transparent dark:border-gray-700">
          <ProfileAvatar
            label={getInitials(user?.name, user?.email)}
            image={avatarBlobUrl ?? undefined}
            onChange={uploadAvatar}
          />

          <ProfileForm
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
            onSave={handleSave}
          />
        </div>
      </div>
    </Layout>
  );
};
