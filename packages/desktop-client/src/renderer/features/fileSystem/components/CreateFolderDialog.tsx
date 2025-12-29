import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface CreateFolderDialogProps {
  visible: boolean;
  onHide: () => void;
  onCreate: (name: string) => void;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  visible,
  onHide,
  onCreate,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (visible) setName("");
  }, [visible]);

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim());
      onHide();
    }
  };

  const footer = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="New Folder"
      visible={visible}
      style={{ width: "30vw", minWidth: "400px" }}
      onHide={onHide}
      footer={footer}
    >
      <div className="p-fluid">
        <div className="field">
          <label
            htmlFor="foldername"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <InputText
            id="foldername"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>
    </Dialog>
  );
};
