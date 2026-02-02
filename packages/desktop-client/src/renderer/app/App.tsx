import { useEffect } from "react";
import { Providers } from "./providers";
import { AppRouter } from "./routers/AppRouter";
import { useTheme } from "@features/settings/hooks/useTheme";
import { PrimeToastProvider } from "@shared/utils";
import { socketClient } from "@renderer/shared/api";
import { useFileSystemStore } from "@renderer/entities/fileSystem";

function App() {
  useTheme();
const { initializeStoreListeners } = useFileSystemStore();
  useEffect(() => {
    socketClient.connect("");
    const cleanup = initializeStoreListeners();
    return () => {
      cleanup();
      socketClient.disconnect();
    };
  }, []);

  return (
    <Providers>
      <PrimeToastProvider />
      <AppRouter />
    </Providers>
  );
}

export default App;
