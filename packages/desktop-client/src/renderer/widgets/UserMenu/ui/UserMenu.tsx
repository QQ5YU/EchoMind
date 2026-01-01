import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@entities/user/model/store";

export const UserMenu: React.FC = () => {
  const menu = useRef<Menu>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
    {
      label: "Account Settings",
      icon: "pi pi-user-edit",
      command: () => navigate("/profile"),
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  // Get display name or fallback
  const displayName = user?.name || user?.email || "User";
  const avatarLabel = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="relative">
      <Menu
        model={items}
        popup
        ref={menu}
        id="user_popup_menu"
        appendTo={document.body}
      />
      <div
        className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls="user_popup_menu"
        aria-haspopup
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-700 leading-tight dark:text-gray-100">
            {displayName}
          </p>
          <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
            Member
          </p>
        </div>
        <Avatar
          label={avatarLabel}
          shape="circle"
          className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
          size="normal"
        />
      </div>
    </div>
  );
};
