import { Box, Heading, HStack, Image, Link } from "@chakra-ui/react";
import { ThemeSwitcher } from "@repo/components";
import { ConnectKitButton } from "connectkit";
import { NetworkSelect } from "./NetworkSelect";

export const Navbar = () => (
  <HStack as="nav" bg="--body-bg" p={4} justify="space-between">
    <HStack spacing={2}>
      <Image src="/logo.png" alt="Vite/AAVE V3 Sample App" boxSize={10} />
      <Box>
        <Heading size="md">Vite Sample App</Heading>
        <Link
          fontSize="xs"
          isExternal
          href="https://github.com/akanoce/react-aave-sdk"
        >
          Powered by react-aave-sdk
        </Link>
      </Box>
    </HStack>
    <HStack spacing={2}>
      <ThemeSwitcher />
      <NetworkSelect />
      <ConnectKitButton />;
    </HStack>
  </HStack>
);
