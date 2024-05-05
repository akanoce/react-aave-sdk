import { useEthersProvider } from "./hooks/useEthersProvider";
import { AaveContractsProvider } from "@aave/react-sdk";
import { useSelectedNetwork } from "./store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export const App = () => {
  const { chainId } = useSelectedNetwork();
  const provider = useEthersProvider({ chainId });
  return (
    <AaveContractsProvider provider={provider} chainId={chainId}>
      <RouterProvider router={router} />
    </AaveContractsProvider>
  );
};
