import {
  UserReserveDataHumanized,
  ReserveDataHumanized,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import {
  FormatUserSummaryResponse,
  FormatReserveUSDResponse,
  formatUserSummary,
} from "@aave/math-utils";
import dayjs from "dayjs";

import { SupportedAddressBook } from "../../utils";
import {
  GetReservesResponse,
  getReserves,
  getReservesQueryKey,
} from "../useReserves/useReserves";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers";

export type GetUserReservesResponse = {
  userReserves: {
    userReserves: UserReserveDataHumanized[];
    userEmodeCategoryId: number;
  };
  formattedReserves: FormatUserSummaryResponse<
    ReserveDataHumanized & FormatReserveUSDResponse
  >;
};
/**
 * Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * @param poolDataProviderContract  The Aave V3 UI Pool Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @param reservesResponse  The response from the getReserves function
 * @returns  Object containing array of pool reserves and market base currency data
 */
export const getUserReserves = async (
  poolDataProviderContract: UiPoolDataProvider,
  chainAddressBook: SupportedAddressBook,
  user: string,
  reservesResponse: GetReservesResponse
): Promise<GetUserReservesResponse> => {
  // Object containing array or users aave positions and active eMode category
  // { userReserves, userEmodeCategoryId }
  const userReserves = await poolDataProviderContract.getUserReservesHumanized({
    lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER,
    user,
  });

  return {
    userReserves,
    formattedReserves: formatUserSummary({
      userReserves: userReserves.userReserves,
      userEmodeCategoryId: userReserves.userEmodeCategoryId,
      currentTimestamp: dayjs().unix(),
      marketReferenceCurrencyDecimals:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyPriceInUsd,
      formattedReserves: reservesResponse.formattedReserves,
    }),
  };
};

export const getUserReservesQueryKey = (chainId: number, user?: string) => [
  "AAVE",
  chainId,
  "USER_RESERVES",
  user,
];

/** Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * see {@link getUserReserves}
 * @param user
 * @returns Query object containing array of pool reserves and market base currency data
 */
export const useUserReserves = (user?: string) => {
  const { poolDataProviderContract, chainAddressBook } = useAaveContracts();
  const queryClient = useQueryClient();

  const enabled = !!poolDataProviderContract && !!chainAddressBook && !!user;
  return useQuery({
    queryKey: getUserReservesQueryKey(chainAddressBook.CHAIN_ID, user),
    queryFn: async () => {
      if (!enabled) return null;
      const reserves = await queryClient.ensureQueryData({
        queryKey: getReservesQueryKey(chainAddressBook.CHAIN_ID),
        queryFn: () => getReserves(poolDataProviderContract, chainAddressBook),
      });
      return await getUserReserves(
        poolDataProviderContract,
        chainAddressBook,
        user,
        reserves
      );
    },
    enabled,
  });
};
