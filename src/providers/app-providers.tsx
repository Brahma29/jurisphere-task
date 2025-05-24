"use client";

import { Suspense, type ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/react-query-client";
import { Toaster } from "sonner";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>{children}</Suspense>
      <Toaster position="top-center" duration={1000} />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
