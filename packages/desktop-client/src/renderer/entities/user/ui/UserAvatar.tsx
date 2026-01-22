import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { WaveLoader } from "@shared/ui";

interface UserAvatarProps {
  label: string;
  image?: string;
  onChange?: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  label,
  image,
  onChange,
  isUploading,
  uploadProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isUploading) return;
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
        style={{ width: "80px", height: "80px" }}
      >
        <Avatar
          label={!image ? label : undefined}
          image={image}
          shape="circle"
          style={{ width: "80px", height: "80px", fontSize: "3rem" }}
          className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 shadow-lg border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden"
        />

        {/* --- Overlay Content --- */}
        {!isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-full transition-all duration-200">
            <i className="pi pi-camera text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 rounded-full text-indigo-200 bg-black/40 flex items-center justify-center">
            <WaveLoader progress={uploadProgress ?? 0} size={80} />
            <span className="absolute text-white text-lg font-bold">
              {uploadProgress}%
            </span>
          </div>
        )}
        {/* --- End Overlay Content --- */}

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
