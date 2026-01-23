import React, { useState, useEffect } from "react";
import { MainLayout } from "@shared/ui";
import { Sidebar } from "@widgets/Sidebar";
import { UserMenu } from "@widgets/UserMenu";
import { SearchBar } from "@features/search";
import { FileExplorer } from "@widgets/FileExplorer";
import { useFileSystemStore } from "@entities/fileSystem";

export const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const fetchAll = useFileSystemStore((state) => state.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <MainLayout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <div className="max-w-5xl mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FileExplorer searchQuery={searchQuery} />
      </div>
    </MainLayout>
  );
};
