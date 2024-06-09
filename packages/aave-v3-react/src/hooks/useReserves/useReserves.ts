import {
  ReserveDataHumanized,
  ReservesDataHumanized,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import { FormatReserveUSDResponse, formatReserves } from "@aave/math-utils";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAaveContracts } from "@/providers";
import { SupportedAddressBook } from "@/utils";

export type GetReservesResponse = {
  reserves: ReservesDataHumanized;
  formattedReserves: (ReserveDataHumanized & FormatReserveUSDResponse)[];
};
/**
 * Fetches pool reserves and market base currency data from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract   The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getReserves = async (
  poolDataProviderContract: UiPoolDataProvider,
  chainAddressBook: SupportedAddressBook,
): Promise<GetReservesResponse> => {
  // Object containing array of pool reserves and market base currency data
  // { reservesArray, baseCurrencyData }
  const reserves = await poolDataProviderContract.getReservesHumanized({
    lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER,
  });

  return {
    reserves,
    formattedReserves: formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp: dayjs().unix(),
      marketReferenceCurrencyDecimals:
        reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    }),
  };
};

export const getReservesQueryKey = (chainId: string | number) => [
  "AAVE",
  chainId,
  "RESERVES",
];

/**
 * Fetches pool reserves and market base currency data from the Aave V3 UI Pool Data Provider contract
 * @returns  Query object containing array of pool reserves and market base currency data
 * @example
 * ```tsx
 * const { data } = useReserves();
 * ```
 */
export const useReserves = () => {
  const { poolDataProviderContract, chainAddressBook } = useAaveContracts();

  const enabled = !!poolDataProviderContract && !!chainAddressBook;
  return useQuery({
    queryKey: getReservesQueryKey(chainAddressBook.CHAIN_ID),
    queryFn: async () =>
      enabled ? getReserves(poolDataProviderContract, chainAddressBook) : null,
    enabled,
  });
};
