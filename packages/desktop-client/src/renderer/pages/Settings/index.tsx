import React, { useState, useRef } from "react";
import { Layout } from "@shared/ui/Layout";
import { Sidebar } from "@widgets/Sidebar";
import { UserMenu } from "@widgets/UserMenu";
import { Button } from "primereact/button";
import { TranscriptionSettings } from "@features/settings/ui/TranscriptionSettings";
import { ThemeSettings } from "@features/settings/ui/ThemeSettings";
import { useSettingsStore } from "@entities/settings";
import { toastService, ToastSeverity } from "@renderer/shared";

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useSettingsStore();
  const [tempLanguage, setTempLanguage] = useState("en");
  const [tempTheme, setTempTheme] = useState<"light" | "dark">(theme);

  const handleSave = () => {
    setTheme(tempTheme);

    setTimeout(() => {
      toastService.show(ToastSeverity.SUCCESS, "Settings saved successfully");
    }, 300);
  };

  return (
    <Layout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          App Settings
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 space-y-12">
          <ThemeSettings theme={tempTheme} onChange={setTempTheme} />

          <TranscriptionSettings
            language={tempLanguage}
            onChange={setTempLanguage}
          />

          <div className="pt-6 border-t dark:border-gray-700 flex justify-end">
            <Button
              label="Save Changes"
              icon="pi pi-check"
              onClick={handleSave}
              className="text-white"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
