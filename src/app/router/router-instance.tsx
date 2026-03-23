import { router } from "./router-instance-impl";

export { router };

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

