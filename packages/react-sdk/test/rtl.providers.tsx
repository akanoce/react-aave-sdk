import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { AaveContractsProvider } from "../src";
import { ethers } from "ethers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const chainId = sepolia.id;
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const provider = ethers.getDefaultProvider(chainId);
  return (
    <QueryClientProvider client={queryClient}>
      <AaveContractsProvider provider={provider} chainId={chainId}>
        {children}
      </AaveContractsProvider>
    </QueryClientProvider>
  );
};
