import React from "react";
import {
  HStack,
  Heading,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { CryptoIconMap, genericCryptoIcon } from "../CryptoIcons";
import {
  formatAPY,
  formatBalance,
  type GetReservesResponse,
} from "@aave/react-sdk";

type Props = {
  formattedReserves: GetReservesResponse["formattedReserves"];
  tableCaption?: React.ReactNode;
};

export const ReservesTable: React.FC<Props> = ({
  formattedReserves,
  tableCaption,
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>{tableCaption}</TableCaption>
        <Thead>
          <Tr>
            <Th>Token</Th>
            <Th>Price</Th>
            <Th>Available liquidity</Th>
            <Th>Total debt</Th>
            <Th>Caps</Th>
            <Th>APY - Supply/Borrow</Th>
          </Tr>
        </Thead>
        <Tbody>
          {formattedReserves.map((reserve) => (
            <Tr key={reserve.id}>
              <Td>
                <HStack spacing={2}>
                  <Image
                    src={
                      CryptoIconMap[reserve.symbol.toUpperCase()] ??
                      genericCryptoIcon
                    }
                    alt={reserve.symbol}
                    boxSize="30px"
                  />
                  <Heading size="sm">{reserve.name}</Heading>
                </HStack>
              </Td>
              <Td>
                <VStack spacing={0} justify={"flex-start"} align={"flex-start"}>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(reserve.availableLiquidity)}
                    </Heading>
                    <Text size="sm" as="sub">
                      {reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(reserve.availableLiquidityUSD)}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <Heading size="sm">
                  {new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(reserve.priceInUSD))}
                </Heading>
              </Td>
              <Td>
                <VStack spacing={0} justify={"flex-start"} align={"flex-start"}>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(reserve.totalDebt)}
                    </Heading>
                    <Text size="sm" as="sub">
                      {reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(reserve.totalDebtUSD)}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <VStack spacing={0} justify={"flex-start"} align={"flex-start"}>
                  <Heading size="sm" color="green">
                    S {formatBalance(reserve.supplyCap)}
                  </Heading>
                  <Heading size="sm" color="orange">
                    B {formatBalance(reserve.borrowCap)}
                  </Heading>
                </VStack>
              </Td>

              <Td>
                <VStack spacing={0} justify={"flex-start"} align={"flex-start"}>
                  <Heading size="sm" color="green">
                    S {formatAPY(reserve.supplyAPY)}
                  </Heading>
                  <Heading size="sm" color="orange">
                    B {formatAPY(reserve.variableBorrowAPY)}
                  </Heading>
                </VStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
