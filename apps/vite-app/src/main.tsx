import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider } from "connectkit";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ConnectKitProvider>
            <App />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  </React.StrictMode>
);
