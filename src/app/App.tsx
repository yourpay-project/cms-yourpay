import type { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalContainer } from "@/widgets/modal-manager";
import { AppRouter } from "./router/router";

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
      <AppRouter />
      <ModalContainer />
    </QueryClientProvider>
  );
};

export default App;

