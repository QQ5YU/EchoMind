import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";

interface ProfileAvatarProps {
  label: string;
  image?: string;
  onChange?: (file: File) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  label,
  image,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  return (
    <div className="flex justify-center mb-12">
      <div
        className="group relative cursor-pointer"
        onClick={handleClick}
      >
        <Avatar
          label={!image ? label : undefined}
          image={image}
          shape="circle"
          style={{ width: "80px", height: "80px", fontSize: "3rem" }}
          className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-lg border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-full transition-all duration-200">
          <i className="pi pi-camera text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
      </div>
    </div>
  );
};
