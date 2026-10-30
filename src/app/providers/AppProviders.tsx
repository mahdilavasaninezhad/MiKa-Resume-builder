import type { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider";
import { AppToaster } from "../../shared/components/feedback/AppToaster";

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryProvider>{children}<AppToaster /></QueryProvider>;
}
