"use client";

import { formatBalance, useUserReserves } from "aave-v3-react";
import { UserReservesTable } from "@repo/components";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

export default function UserReserves() {
  const { address } = useAccount();

  const { data: userReserves, isLoading: reservesLoading } =
    useUserReserves(address);

  if (!address)
    return (
      <Card w="full">
        <CardHeader>
          <Heading size="md">Connect your wallet first</Heading>
        </CardHeader>
        <CardBody>
          <Text>
            To view your user reserves, please connect your wallet first.
          </Text>
        </CardBody>
      </Card>
    );
  if (reservesLoading)
    return (
      <Card w="full">
        <CardHeader>
          <Heading size="md">Aave V3 User Reserves</Heading>
        </CardHeader>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );

  if (!userReserves) return null;

  return (
    <Card w="full">
      <CardHeader>
        <VStack align="start" spacing={2} w="full">
          <Heading size="md">Aave V3 User Reserves</Heading>
          <Stack
            spacing={[4, 4, 8]}
            direction={["column", "column", "row"]}
            align="flex-start"
          >
            <Box>
              <Text textTransform="uppercase" color="gray.500">
                Total Liquidity
              </Text>
              <Heading size="sm">
                {formatBalance(
                  userReserves?.formattedReserves.totalLiquidityUSD,
                  "USD",
                )}
              </Heading>
            </Box>
            <Box>
              <Text textTransform="uppercase" color="gray.500">
                Total Borrow
              </Text>
              <Heading size="sm">
                {formatBalance(
                  userReserves?.formattedReserves.totalBorrowsUSD,
                  "USD",
                )}
              </Heading>
            </Box>
            <Box>
              <Text textTransform="uppercase" color="gray.500">
                Net Worth
              </Text>
              <Heading size="sm">
                {formatBalance(
                  userReserves?.formattedReserves.netWorthUSD,
                  "USD",
                )}
              </Heading>
            </Box>
          </Stack>
        </VStack>
      </CardHeader>
      <CardBody>
        <UserReservesTable
          userReserves={userReserves.formattedReserves}
          tableCaption="Aave V3 User Reserves"
        />
      </CardBody>
    </Card>
  );
}
