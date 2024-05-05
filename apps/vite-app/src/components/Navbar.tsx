import { Heading, HStack } from "@chakra-ui/react";
import { NetworkSelect } from "./NetworkSelect";

export const Navbar = () => {
  return (
    <HStack as="nav" bg="gray.800" color="white" p={4} justify="space-between">
      <Heading size="md">Vite App</Heading>
      <HStack>
        <NetworkSelect />
      </HStack>
    </HStack>
  );
};
