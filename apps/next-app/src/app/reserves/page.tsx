"use client";

import { formatBalance, useReserves } from "@aave/react-sdk";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReservesTable } from "@repo/components";
import { useMemo } from "react";

export default function Reserves() {
  const { data: reserves, isLoading: reservesLoading } = useReserves();

  const totalLiquidity = useMemo(
    () =>
      reserves?.formattedReserves.reduce(
        (acc, reserve) => acc + Number(reserve.totalLiquidityUSD),
        0,
      ),
    [reserves],
  );

  const totalDebt = useMemo(
    () =>
      reserves?.formattedReserves.reduce(
        (acc, reserve) => acc + Number(reserve.totalDebtUSD),
        0,
      ),
    [reserves],
  );

  if (reservesLoading)
    return (
      <Card w="full">
        <CardHeader>
          <Heading size="md">Aave V3 Reserves</Heading>
        </CardHeader>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );

  if (!reserves) return null;

  return (
    <Card w="full">
      <CardHeader>
        <VStack align="start" spacing={2} w="full">
          <Heading size="md">Aave V3 Reserves</Heading>
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
                {formatBalance(totalLiquidity, "USD")}
              </Heading>
            </Box>
            <Box>
              <Text textTransform="uppercase" color="gray.500">
                Total debt
              </Text>
              <Heading size="sm">{formatBalance(totalDebt, "USD")}</Heading>
            </Box>
          </Stack>
        </VStack>
      </CardHeader>
      <CardBody>
        <ReservesTable
          formattedReserves={reserves.formattedReserves}
          tableCaption="Aave V3 Reserves"
        />
      </CardBody>
    </Card>
  );
}
