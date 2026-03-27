import type { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalContainer } from "@/widgets/modal-manager";
import { TooltipProvider } from "@/shared/ui";
import { AppRouter } from "./router/router";
import { GlobalMutationLoader } from "@/shared/ui/GlobalMutationLoader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <ModalContainer />
        <GlobalMutationLoader />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

