import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFileSystemStore } from "@entities/fileSystem";
import { useFileBrowserStore } from "@features/fileBrowser";
import { CreateFolderDialog } from "@features/fileSystem/ui/CreateFolderDialog";
import { DeleteFolderDialog } from "@features/fileSystem/ui/DeleteFolderDialog";
import { ROUTES } from "@renderer/shared/config/routes";

export const SidebarFolderList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { folders, addFolder, deleteFolder } = useFileSystemStore();
  const { currentFolderId, setCurrentFolder } = useFileBrowserStore();

  const [isNewFolderVisible, setIsNewFolderVisible] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);

  const isSettingsPage = location.pathname === ROUTES.SETTINGS;
  const isDashboardPage = location.pathname === ROUTES.DASHBOARD;

  const handleConfirmDeleteFolder = () => {
    if (deleteFolderId) {
      deleteFolder(deleteFolderId);
      if (currentFolderId === deleteFolderId) setCurrentFolder(null);
    }
  };

  const handleNavigateDashboard = (folderId: string) => {
    setCurrentFolder(folderId);
    if (!isDashboardPage) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <>
      <div className="pt-4 pb-2 flex items-center justify-between text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        <span>Folders</span>
        <button
          onClick={() => setIsNewFolderVisible(true)}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <i className="pi pi-plus" />
        </button>
      </div>

      <ul className="space-y-2">
        {folders.map((folder) => (
          <li
            key={folder.id}
            className={`p-2 rounded cursor-pointer flex items-center gap-3 transition-colors group justify-between ${
              !isSettingsPage && currentFolderId === folder.id
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                : "hover:bg-gray-50 text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleNavigateDashboard(folder.id)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <i className="pi pi-folder flex-shrink-0" />
              <span className="truncate">{folder.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteFolderId(folder.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-all"
              title="Delete Folder"
            >
              <i className="pi pi-trash text-xs" />
            </button>
          </li>
        ))}
      </ul>

      <CreateFolderDialog
        visible={isNewFolderVisible}
        onHide={() => setIsNewFolderVisible(false)}
        onCreate={addFolder}
      />

      <DeleteFolderDialog
        visible={!!deleteFolderId}
        onHide={() => setDeleteFolderId(null)}
        onConfirm={handleConfirmDeleteFolder}
      />
    </>
  );
};
