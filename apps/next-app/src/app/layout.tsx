"use client";

import React, { useState } from "react";
import { ChakraProvider, Container, HStack } from "@chakra-ui/react";
import { AaveContractsProvider } from "aave-v3-react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Navbar } from "@/components/Navbar";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { config } from "@/lib/wagmi-config";
import { ConnectKitProvider } from "connectkit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(new QueryClient());
  return (
    <html lang="en">
      <body>
        <React.StrictMode>
          <ChakraProvider>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <ConnectKitProvider>
                  <AaveContractsProvider>
                    <Navbar />
                    <Container
                      maxW={["container.3xl", "container.2xl", "container.xl"]}
                    >
                      <HStack spacing={4} py={4} w="full" align="stretch">
                        <DesktopSidebar />
                        {children}
                      </HStack>
                    </Container>
                  </AaveContractsProvider>
                </ConnectKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </ChakraProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
