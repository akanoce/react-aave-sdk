import { Heading, HStack } from "@chakra-ui/react";
import { NetworkSelect } from "@/app/ui/NetworkSelect";
import { ThemeSwitcher } from "@repo/components";

export const Navbar = () => (
  <HStack as="nav" bg="gray.800" color="white" p={4} justify="space-between">
    <Heading size="md">Vite App</Heading>
    <HStack spacing={2}>
      <ThemeSwitcher />
      <NetworkSelect />
    </HStack>
  </HStack>
);
