import {
  VStack,
  Heading,
  Divider,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RRLink, useLocation } from "react-router-dom";
import { Menu } from "./Menu";

export const DesktopSidebar = () => {
  const location = useLocation();

  return (
    <Box
      as="nav"
      pos="sticky"
      top={20}
      left="0"
      h="full"
      w="64"
      bg="--body-bg"
      borderRightWidth="1px"
      borderRightColor="gray"
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
        {Menu.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <ChakraLink
              as={RRLink}
              key={item.route}
              to={item.route}
              color={isActive ? "blue.500" : "inherit"}
            >
              <Heading size="sm">{item.title}</Heading>
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};
