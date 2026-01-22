import React, { useState, useRef } from "react";
import { Layout } from "@shared/ui/Layout";
import { Sidebar } from "@widgets/Sidebar";
import { UserMenu } from "@widgets/UserMenu";
import { Toast } from "primereact/toast";
import { ProfileForm } from "./ui/ProfileForm";
import { useProfileSettings, AvatarUpload } from "@features/profile";

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useProfileSettings();

  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const toast = useRef<Toast>(null);

  const handleSave = async () => {
    await updateProfile(name);
  };

  return (
    <Layout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <Toast ref={toast} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Account Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-transparent dark:border-gray-700">
          <AvatarUpload />

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
