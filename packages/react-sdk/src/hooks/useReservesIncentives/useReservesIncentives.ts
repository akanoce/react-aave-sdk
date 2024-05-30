import {
  ReserveDataHumanized,
  ReservesIncentiveDataHumanized,
  UiIncentiveDataProvider,
} from "@aave/contract-helpers";
import {
  FormatReserveUSDResponse,
  formatReservesAndIncentives,
} from "@aave/math-utils";
import dayjs from "dayjs";
import { SupportedAddressBook } from "../../utils";
import {
  GetReservesResponse,
  getReserves,
  getReservesQueryKey,
} from "../useReserves/useReserves";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers";
import { getUserReserves } from "../useUserReserves/useUserReserves";

export type GetReservesIncentives = {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  formattedReservesIncentives: (ReserveDataHumanized &
    FormatReserveUSDResponse)[];
};

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param reservesResponse  The response from the getReserves function
 * @returns Object containing array of pool reserves and market base currency data
 */
export const getReservesIncentives = async (
  incentiveDataProviderContract: UiIncentiveDataProvider,
  chainAddressBook: SupportedAddressBook,
  reservesResponse: GetReservesResponse
): Promise<GetReservesIncentives> => {
  // Array of incentive tokens with price feed and emission APR
  const reserveIncentives =
    await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
      lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER,
    });

  return {
    reserveIncentives,
    formattedReservesIncentives: formatReservesAndIncentives({
      reserves: reservesResponse.reserves.reservesData,
      reserveIncentives,
      currentTimestamp: dayjs().unix(),
      marketReferenceCurrencyDecimals:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyPriceInUsd,
    }),
  };
};

export const getReservesIncentivesQueryKey = (chainId: string | number) => [
  "AAVE",
  chainId,
  "RESERVES_INCENTIVES",
];

/** Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * see {@link getUserReserves}
 * @param user
 * @returns Query object containing array of pool reserves and market base currency data
 * @example
 * ```tsx
 * const { data } = useReservesIncentives({ user });
 * ```
 */
export const useReservesIncentives = () => {
  const {
    poolDataProviderContract,
    incentiveDataProviderContract,
    chainAddressBook,
  } = useAaveContracts();
  const queryClient = useQueryClient();

  const enabled =
    !!poolDataProviderContract &&
    !!chainAddressBook &&
    !!incentiveDataProviderContract;
  return useQuery({
    queryKey: getReservesIncentivesQueryKey(chainAddressBook.CHAIN_ID),
    queryFn: async () => {
      if (!enabled) return null;
      const reserves = await queryClient.ensureQueryData({
        queryKey: getReservesQueryKey(chainAddressBook.CHAIN_ID),
        queryFn: () => getReserves(poolDataProviderContract, chainAddressBook),
      });
      return await getReservesIncentives(
        incentiveDataProviderContract,
        chainAddressBook,
        reserves
      );
    },
    enabled,
  });
};
