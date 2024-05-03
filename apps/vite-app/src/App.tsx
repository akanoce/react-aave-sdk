import { VStack } from "@chakra-ui/react";
import { UserReserves } from "./components";
import { Reserves } from "./components/Reserves";
import { useEthersProvider } from "./hooks/useEthersProvider";
import { mainnet } from "viem/chains";
import { AaveContractsProvider } from "@aave/react-sdk";

const chainId = mainnet.id;
export const App = () => {
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
