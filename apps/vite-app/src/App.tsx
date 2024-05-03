import { VStack } from "@chakra-ui/react";
import { UserReserves } from "./components";
import { Reserves } from "./components/Reserves";
import { useEthersProvider } from "./hooks/useEthersProvider";
import { sepolia } from "viem/chains";
import { AaveContractsProvider } from "@aave/react-sdk";

export const App = () => {
  const provider = useEthersProvider({ chainId: sepolia.id });
  console.log("p", provider);
  return (
    <AaveContractsProvider provider={provider}>
      <VStack spacing={4} w="full">
        <Reserves />
        <UserReserves />
      </VStack>
    </AaveContractsProvider>
  );
};
