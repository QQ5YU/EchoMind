import React, { useRef } from "react";
import { Button } from "primereact/button";
import { useFileSystemStore } from "@entities/fileSystem";

interface UploadButtonProps {
  className?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ className }) => {
  const uploadFile = useFileSystemStore((state) => state.uploadFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="audio/*"
        onChange={handleFileChange}
      />
      <Button
        label="Upload Audio"
        icon="pi pi-upload"
        className={className}
        onClick={handleUploadClick}
      />
    </>
  );
};
