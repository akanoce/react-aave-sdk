import { Box, Heading, HStack, Image, Link, Text } from "@chakra-ui/react";
import { ThemeSwitcher } from "@repo/components";
import { NetworkSelect } from "@/components/NetworkSelect";
import { ConnectKitButton } from "connectkit";

export const Navbar = () => (
  <HStack as="nav" bg="--body-bg" p={4} justify="space-between">
    <HStack spacing={2}>
      <Image src="/logo.png" alt="Next/AAVE V3 Sample App" boxSize={10} />
      <Box>
        <Heading size="md">Next Sample App</Heading>
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
      <ConnectKitButton />
    </HStack>
  </HStack>
);
