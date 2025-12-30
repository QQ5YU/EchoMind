import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface DeleteFileDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

export const DeleteFileDialog: React.FC<DeleteFileDialogProps> = ({
  visible,
  onHide,
  onConfirm,
}) => {
  const footer = (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        label="Cancel"
        onClick={onHide}
        className="p-button-text p-button-secondary dark:text-gray-400"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        onClick={() => {
          onConfirm();
          onHide();
        }}
        severity="danger"
        className="text-white"
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Delete File"
      visible={visible}
      style={{ width: "30vw", minWidth: "400px" }}
      onHide={onHide}
      footer={footer}
      pt={{
        header: { className: 'dark:bg-gray-800 dark:text-white border-b dark:border-gray-700' },
        content: { className: 'dark:bg-gray-800 dark:text-gray-300 py-6' },
        footer: { className: 'dark:bg-gray-800 border-t dark:border-gray-700' }
      }}
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-exclamation-triangle text-red-500 text-2xl" />
        <span className="dark:text-gray-300">Are you sure you want to delete this file?</span>
      </div>
    </Dialog>
  );
};
