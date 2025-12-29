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
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        onClick={() => {
          onConfirm();
          onHide();
        }}
        severity="danger"
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
    >
      <div className="flex items-center gap-3">
        <i className="pi pi-exclamation-triangle text-red-500 text-2xl" />
        <span>Are you sure you want to delete this file?</span>
      </div>
    </Dialog>
  );
};
