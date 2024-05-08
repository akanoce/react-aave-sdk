"use client";

import {
  VStack,
  Divider,
  Box,
  Heading,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Reserves", href: "/reserves" },
  {
    name: "User Reserves",
    href: "/user-reserves",
  },
];

export const DesktopSidebar = () => {
  const pathname = usePathname();
  return (
    <Box
      as="nav"
      pos="sticky"
      top={20}
      left="0"
      h="full"
      w="64"
      bg="gray.800"
      color="white"
      borderRightWidth="1px"
      borderRightColor="gray.700"
      overflowY="auto"
      flexShrink={0}
      display={["none", "block"]}
    >
      <VStack
        spacing={4}
        align="flex-start"
        justify="flex-start"
        w="full"
        p={4}
        divider={<Divider />}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <ChakraLink
              as={Link}
              key={link.name}
              href={link.href}
              color={isActive ? "blue.500" : "inherit"}
            >
              <Heading size="sm">{link.name}</Heading>
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};
