"use client";

import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { FC, cache } from "react";
import getCacheQueryClient from "./getQueryCache";

interface TanstaqProviderProps {
  children: React.ReactNode;
}

function makeQueryClient() {
  // return new QueryClient({
  return getCacheQueryClient();
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const TanstaqProvider: FC<TanstaqProviderProps> = (param) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {param.children}
    </QueryClientProvider>
  );
};

export default TanstaqProvider;
