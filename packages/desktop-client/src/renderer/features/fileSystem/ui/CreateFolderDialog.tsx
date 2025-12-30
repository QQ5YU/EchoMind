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
    <div className="flex justify-end gap-2 pt-2">
      <Button
        label="Cancel"
        onClick={onHide}
        className="p-button-text p-button-secondary dark:text-gray-400"
      />
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={handleSubmit}
        className="text-white"
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
      className="dark:bg-gray-800"
      pt={{
        header: { className: 'dark:bg-gray-800 dark:text-white border-b dark:border-gray-700' },
        content: { className: 'dark:bg-gray-800 dark:text-gray-300 py-6' },
        footer: { className: 'dark:bg-gray-800 border-t dark:border-gray-700' }
      }}
    >
      <div className="p-fluid">
        <div className="field">
          <label
            htmlFor="foldername"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
