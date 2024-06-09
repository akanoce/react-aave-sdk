import { AaveContractsProvider } from "react-aave-v3";
import { RouterProvider } from "react-router-dom";
import { useEthersProvider } from "./hooks/useEthersProvider";
import { useSelectedNetwork } from "./store";
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
