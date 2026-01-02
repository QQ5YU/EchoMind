import React, { useState } from "react";
import { Layout } from "@shared/ui/Layout";
import { Sidebar } from "@widgets/Sidebar";
import { UserMenu } from "@widgets/UserMenu";
import { SearchBar } from "@features/search";
import { FileExplorer } from "@widgets/FileExplorer";

export const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout sidebar={<Sidebar />} headerRight={<UserMenu />}>
      <div className="max-w-5xl mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FileExplorer searchQuery={searchQuery} />
      </div>
    </Layout>
  );
};