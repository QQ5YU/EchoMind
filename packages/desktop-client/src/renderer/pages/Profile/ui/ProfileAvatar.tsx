import React from "react";
import { Avatar } from "primereact/avatar";

interface ProfileAvatarProps {
  label: string;
  onChange?: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  label,
  onChange,
}) => {
  return (
    <div className="flex justify-center mb-12">
      <div 
        className="group relative cursor-pointer"
        onClick={onChange}
      >
        {/* Main Avatar - Massive size */}
        <Avatar
          label={label}
          shape="circle"
          style={{ width: '80px', height: '80px', fontSize: '3rem' }}
          className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-lg border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden"
        />
        
        {/* Hover Overlay - Scaled icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-full transition-all duration-200">
          <i className="pi pi-camera text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
