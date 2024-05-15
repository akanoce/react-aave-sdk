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
import { type GetUserReservesResponse, formatBalance } from "@aave/react-sdk";
import { formatAPY } from "@aave/react-sdk";
import { CryptoIconMap, genericCryptoIcon } from "../CryptoIcons";

type Props = {
  userReserves: GetUserReservesResponse["formattedReserves"];
  tableCaption?: React.ReactNode;
};

export const UserReservesTable: React.FC<Props> = ({
  userReserves,
  tableCaption,
}) => (
  <TableContainer>
    <Table variant="simple">
      <TableCaption>{tableCaption}</TableCaption>
      <Thead>
        <Tr>
          <Th>Token</Th>
          <Th>Balance</Th>
          <Th>Stable Borrows</Th>
          <Th>Variable Borrows</Th>
          <Th>Total Borrows</Th>
          <Th>Stable Borrows - APY-APR</Th>
        </Tr>
      </Thead>
      <Tbody>
        {userReserves.userReservesData
          .filter(
            (userReserve) =>
              userReserve.underlyingBalance > 0 || userReserve.totalBorrows > 0,
          )
          .map((userReserve) => (
            <Tr key={userReserve.reserve.id}>
              <Td>
                <HStack spacing={2}>
                  <Image
                    src={
                      CryptoIconMap[userReserve.reserve.symbol.toUpperCase()] ??
                      genericCryptoIcon
                    }
                    alt={userReserve.reserve.symbol}
                    boxSize="30px"
                  />
                  <Heading size="sm">{userReserve.reserve.name}</Heading>
                </HStack>
              </Td>
              <Td>
                <VStack spacing={0} justify="flex-start" align="flex-start">
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(userReserve.underlyingBalance)}
                    </Heading>
                    <Text size="sm" as="sub">
                      {userReserve.reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(userReserve.underlyingBalanceUSD, "USD")}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <VStack spacing={0} justify="flex-start" align="flex-start">
                  <HStack spacing={1}>
                    <Heading size="sm">{userReserve.stableBorrows}</Heading>
                    <Text size="sm" as="sub">
                      {userReserve.reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(userReserve.stableBorrowsUSD, "USD")}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <VStack spacing={0} justify="flex-start" align="flex-start">
                  <HStack spacing={1}>
                    <Heading size="sm">{userReserve.variableBorrows}</Heading>
                    <Text size="sm" as="sub">
                      {userReserve.reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(userReserve.variableBorrowsUSD, "USD")}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <VStack spacing={0} justify="flex-start" align="flex-start">
                  <HStack spacing={1}>
                    <Heading size="sm">{userReserve.totalBorrows}</Heading>
                    <Text size="sm" as="sub">
                      {userReserve.reserve.symbol}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Heading size="sm">
                      {formatBalance(userReserve.totalBorrowsUSD, "USD")}
                    </Heading>
                    <Text size="sm" as="sub">
                      USD
                    </Text>
                  </HStack>
                </VStack>
              </Td>
              <Td>
                <VStack spacing={0} justify="flex-start" align="flex-start">
                  <Heading size="sm" color="green">
                    APY {formatAPY(userReserve.stableBorrowAPY)}
                  </Heading>
                  <Heading size="sm" color="orange">
                    APR {formatAPY(userReserve.stableBorrowAPR)}
                  </Heading>
                </VStack>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  </TableContainer>
);
