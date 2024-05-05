import { VStack } from "@chakra-ui/react";
import { UserReserves } from "./components";
import { Reserves } from "./components/Reserves";
import { useEthersProvider } from "./hooks/useEthersProvider";
import { AaveContractsProvider } from "@aave/react-sdk";
import { useSelectedNetwork } from "./store";

export const App = () => {
  const { chainId } = useSelectedNetwork();
  const provider = useEthersProvider({ chainId });
  return (
    <AaveContractsProvider provider={provider} chainId={chainId}>
      <VStack spacing={4} w="full">
        <Reserves />
        <UserReserves />
      </VStack>
    </AaveContractsProvider>
  );
};
