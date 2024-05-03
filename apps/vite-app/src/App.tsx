import { VStack } from "@chakra-ui/react";
import { UserReserves } from "./components";
import { Reserves } from "./components/Reserves";

export const App = () => {
  return (
    <VStack spacing={4} w="full">
      <Reserves />
      <UserReserves />
    </VStack>
  );
};
