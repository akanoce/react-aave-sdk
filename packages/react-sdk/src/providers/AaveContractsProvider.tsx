import {
  Pool,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import { createContext, useContext, useMemo } from "react";
import { providers } from "ethers";

import { SupportedAddressBook, getAddressBookFromChainid } from "../utils";

interface CurrentUserContextType {
  poolDataProviderContract: UiPoolDataProvider | null;
  incentiveDataProviderContract: UiIncentiveDataProvider | null;
  chainAddressBook: SupportedAddressBook;
  poolContract: Pool | null;
}

const AaveContractsContext = createContext<CurrentUserContextType | null>(null);

type Props = {
  children: React.ReactNode;
  provider: providers.Provider;
  chainId: number;
};
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

  const data = useMemo(
    () => ({
      poolDataProviderContract,
      incentiveDataProviderContract,
      chainAddressBook,
      poolContract,
    }),
    [
      poolDataProviderContract,
      incentiveDataProviderContract,
      chainAddressBook,
      poolContract,
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
