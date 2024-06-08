import {
  Pool,
  PoolBundle,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import { createContext, useContext, useMemo } from "react";
import { providers } from "ethers";

import { SupportedAddressBook, getAddressBookFromChainid } from "../utils";

/**
 * Context to provide Aave V3 contracts to the app
 * @param children The children of the provider
 * @param provider The ethers provider
 * @param poolDataProviderContract The Aave V3 UI Pool Data Provider contract
 * @param incentiveDataProviderContract The Aave V3 UI Incentive Data Provider contract
 * @param chainAddressBook The Aave V3 address book for the current chain
 * @param poolContract The Aave V3 pool contract
 * @param poolBundleContract The Aave V3 pool bundle contract
 */
interface CurrentUserContextType {
  provider: providers.Provider;
  poolDataProviderContract: UiPoolDataProvider | null;
  incentiveDataProviderContract: UiIncentiveDataProvider | null;
  chainAddressBook: SupportedAddressBook;
  poolContract: Pool | null;
  poolBundleContract: PoolBundle | null;
}

const AaveContractsContext = createContext<CurrentUserContextType | null>(null);

type Props = {
  children: React.ReactNode;
  provider: providers.Provider;
  chainId: number;
};
/**
 *
 * @param children - The children of the provider
 * @param provider - The ethers provider
 * @param chainId - The chain id
 * @returns The Aave V3 contracts provider
 */
export const AaveContractsProvider = ({
  children,
  provider,
  chainId,
}: Props) => {
  const chainAddressBook = useMemo(
    () => getAddressBookFromChainid(chainId),
    [chainId]
  );

  // View contract used to fetch all reserves data (including market base currency data), and user reserves
  // Using Aave V3 Eth Mainnet address for demo
  const poolDataProviderContract = useMemo(
    () =>
      provider
        ? new UiPoolDataProvider({
            uiPoolDataProviderAddress: chainAddressBook.UI_POOL_DATA_PROVIDER,
            provider,
            chainId: chainAddressBook.CHAIN_ID,
          })
        : null,
    [provider, chainAddressBook]
  );

  // View contract used to fetch all reserve incentives (APRs), and user incentives
  // Using Aave V3 Eth Mainnet address for demo
  const incentiveDataProviderContract = useMemo(
    () =>
      provider
        ? new UiIncentiveDataProvider({
            uiIncentiveDataProviderAddress:
              chainAddressBook.UI_INCENTIVE_DATA_PROVIDER,
            provider,
            chainId: chainAddressBook.CHAIN_ID,
          })
        : null,
    [provider, chainAddressBook]
  );

  const poolContract = useMemo(
    () =>
      provider
        ? new Pool(provider, {
            POOL: chainAddressBook.POOL, // Goerli GHO market
            WETH_GATEWAY: chainAddressBook.WETH_GATEWAY, // Goerli GHO market
          })
        : null,
    [provider, chainAddressBook]
  );

  const poolBundleContract = useMemo(
    () =>
      provider
        ? new PoolBundle(provider, {
            POOL: chainAddressBook.POOL, // Goerli GHO market
            WETH_GATEWAY: chainAddressBook.WETH_GATEWAY, // Goerli GHO market
          })
        : null,
    [provider, chainAddressBook]
  );

  const data = useMemo(
    () => ({
      provider,
      poolDataProviderContract,
      incentiveDataProviderContract,
      chainAddressBook,
      poolContract,
      poolBundleContract,
    }),
    [
      provider,
      poolDataProviderContract,
      incentiveDataProviderContract,
      chainAddressBook,
      poolContract,
      poolBundleContract,
    ]
  );
  return (
    <AaveContractsContext.Provider value={data}>
      {children}
    </AaveContractsContext.Provider>
  );
};

export const useAaveContracts = () => {
  const context = useContext(AaveContractsContext);

  if (!context)
    throw new Error(
      "AaveContractsContext has to be used within <AaveContractsContext.Provider>"
    );

  return context;
};
