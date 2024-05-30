import { UiIncentiveDataProvider } from "@aave/contract-helpers";
import { formatUserSummaryAndIncentives } from "@aave/math-utils";
import {
  GetReservesResponse,
  getReserves,
  getReservesQueryKey,
} from "../useReserves/useReserves";
import {
  GetUserReservesResponse,
  getUserReserves,
  getUserReservesQueryKey,
} from "../useUserReserves/useUserReserves";
import { SupportedAddressBook } from "../../utils";
import {
  GetReservesIncentives,
  getReservesIncentives,
  getReservesIncentivesQueryKey,
} from "../useReservesIncentives/useReservesIncentives";
import dayjs from "dayjs";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers";

/**
 *
 * @param incentiveDataProviderContract  The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook  The Aave V3 address book for the current chain
 * @param user  The user's ethereum address
 * @param reservesIncentivesResponse  The response from the getReserves function
 * @returns Object containing array of pool reserves and market base currency data
 */
export const getUserReservesIncentives = async (
  incentiveDataProviderContract: UiIncentiveDataProvider,
  chainAddressBook: SupportedAddressBook,
  user: string,
  reservesResponse: GetReservesResponse,
  reserveIncentivesResponse: GetReservesIncentives,
  userReserves: GetUserReservesResponse
) => {
  // Dictionary of claimable user incentives
  const userReservesIncentives =
    await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
      lendingPoolAddressProvider: chainAddressBook.POOL_ADDRESSES_PROVIDER,
      user,
    });
  return {
    userReservesIncentives,
    formattedUserSummary: formatUserSummaryAndIncentives({
      currentTimestamp: dayjs().unix(),
      marketReferenceCurrencyDecimals:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reservesResponse.reserves.baseCurrencyData
          .marketReferenceCurrencyPriceInUsd,
      userReserves: userReserves.userReserves.userReserves,
      userEmodeCategoryId: userReserves.userReserves.userEmodeCategoryId,
      formattedReserves: reservesResponse.formattedReserves,
      reserveIncentives: reserveIncentivesResponse.reserveIncentives,
      userIncentives: userReservesIncentives,
    }),
  };
};

export const getUserReservesIncentivesQueryKey = (
  chainId: number,
  user?: string
) => ["AAVE", chainId, "USER_RESERVES_INCENTIVES", user];

/** Fetches user reserves and active eMode category from the Aave V3 UI Pool Data Provider contract
 * and user reserves incentives from the Aave V3 UI Incentive Data Provider contract
 * see {@link getUserReservesIncentives}
 * @param user
 * @returns Query object containing array of pool reserves and market base currency data
 * @example
 * ```tsx
 * const { data } = useUserReservesIncentives({ user });
 * ```
 */
export const useUserReservesIncentives = (user?: string) => {
  const {
    poolDataProviderContract,
    incentiveDataProviderContract,
    chainAddressBook,
  } = useAaveContracts();
  const queryClient = useQueryClient();

  const enabled =
    !!poolDataProviderContract &&
    !!chainAddressBook &&
    !!user &&
    !!incentiveDataProviderContract;
  return useQuery({
    queryKey: getUserReservesIncentivesQueryKey(
      chainAddressBook.CHAIN_ID,
      user
    ),
    queryFn: async () => {
      if (!enabled) return null;
      const reserves = await queryClient.ensureQueryData({
        queryKey: getReservesQueryKey(chainAddressBook.CHAIN_ID),
        queryFn: () => getReserves(poolDataProviderContract, chainAddressBook),
      });
      const reservesIncentives = await queryClient.ensureQueryData({
        queryKey: getReservesIncentivesQueryKey(chainAddressBook.CHAIN_ID),
        queryFn: () =>
          getReservesIncentives(
            incentiveDataProviderContract,
            chainAddressBook,
            reserves
          ),
      });
      const userReserves = await queryClient.ensureQueryData({
        queryKey: getUserReservesQueryKey(chainAddressBook.CHAIN_ID, user),
        queryFn: () =>
          getUserReserves(
            poolDataProviderContract,
            chainAddressBook,
            user,
            reserves
          ),
      });
      return await getUserReservesIncentives(
        incentiveDataProviderContract,
        chainAddressBook,
        user,
        reserves,
        reservesIncentives,
        userReserves
      );
    },
    enabled,
  });
};
