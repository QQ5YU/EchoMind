import { Providers } from "./providers";
import { AppRouter } from "./routers/AppRouter";
import { useTheme } from "@features/settings/hooks/useTheme";
import { PrimeToastProvider } from "@shared/utils";

function App() {
  useTheme();

  return (
    <Providers>
      <PrimeToastProvider />
      <AppRouter />
    </Providers>
  );
}

export default App;
