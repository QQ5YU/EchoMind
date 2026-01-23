import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFileBrowserStore } from "@features/fileBrowser";
import { UploadButton } from "@features/fileSystem";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarFolderList } from "./SidebarFolderList";
import { ROUTES } from "@renderer/shared/config/routes";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentFolderId, setCurrentFolder } = useFileBrowserStore();

  const isSettingsPage = location.pathname === ROUTES.SETTINGS;
  const isDashboardPage = location.pathname === ROUTES.DASHBOARD;

  const handleNavigateHome = () => {
    setCurrentFolder(null);
    if (!isDashboardPage) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleNavigateSettings = () => {
    navigate(ROUTES.SETTINGS);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <UploadButton className="w-full text-white" />

      <nav className="flex-1 mt-6 overflow-y-auto min-h-0">
        <ul className="space-y-2">
          <SidebarNavItem
            icon="pi-home"
            label="All Files"
            isActive={!isSettingsPage && currentFolderId === null}
            onClick={handleNavigateHome}
          />

          <SidebarFolderList />
        </ul>
      </nav>

      <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
        <ul className="space-y-2">
          <SidebarNavItem
            icon="pi-cog"
            label="Settings"
            isActive={isSettingsPage}
            onClick={handleNavigateSettings}
          />
        </ul>
      </div>
    </div>
  );
};
