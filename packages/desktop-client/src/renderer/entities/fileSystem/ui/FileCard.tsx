import React from "react";
import { FileNode } from "../model/types";
import { AudioStatus } from "@echomind/shared";

interface FileCardProps {
  file: FileNode;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onClick,
  onDelete,
}) => {
  const getStatusColor = (status: AudioStatus) => {
    switch (status) {
      case AudioStatus.PROCESSED:
        return "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case AudioStatus.PROCESSING:
        return "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case AudioStatus.ERROR:
        return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: AudioStatus) => {
    switch (status) {
      case AudioStatus.PROCESSED:
        return "Processed";
      case AudioStatus.PROCESSING:
        return "Processing...";
      case AudioStatus.ERROR:
        return "Error";
      default:
        return "Pending";
    }
  };

  const isProcessing =
    file.status === AudioStatus.PROCESSING ||
    file.status === AudioStatus.PENDING;

  return (
    <div
      onClick={() => onClick(file.id)}
      className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.id);
        }}
        className="absolute top-3 right-3 p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
        title="Delete File"
      >
        <i className="pi pi-trash" />
      </button>

      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
          <i
            className={`text-xl ${isProcessing ? "pi pi-spin pi-spinner text-indigo-400" : "pi pi-file-audio text-indigo-500 dark:text-indigo-400"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-800 dark:text-gray-200 truncate"
            title={file.name}
          >
            {file.name}
          </h3>
        </div>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full font-medium ${getStatusColor(file.status)}`}
        >
          {getStatusLabel(file.status)}
        </span>
        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
