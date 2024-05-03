import {
  Pool,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import {
  AaveV3Arbitrum,
  AaveV3ArbitrumSepolia,
  AaveV3Avalanche,
  AaveV3Base,
  AaveV3BaseSepolia,
  AaveV3Ethereum,
  AaveV3Fantom,
  AaveV3FantomTestnet,
  AaveV3Fuji,
  AaveV3Gnosis,
  AaveV3Harmony,
  AaveV3Mumbai,
  AaveV3Optimism,
  AaveV3OptimismSepolia,
  AaveV3Polygon,
  AaveV3PolygonZkEvm,
  AaveV3Scroll,
  AaveV3ScrollSepolia,
  AaveV3Sepolia,
} from "@bgd-labs/aave-address-book";
import { createContext, useContext, useMemo } from "react";
import { providers } from "ethers";
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  fantom,
  fantomTestnet,
  gnosis,
  harmonyOne,
  mainnet,
  sepolia,
  polygonMumbai,
  polygon,
  polygonZkEvm,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
} from "viem/chains";

interface CurrentUserContextType {
  poolDataProviderContract: UiPoolDataProvider | null;
  incentiveDataProviderContract: UiIncentiveDataProvider | null;
  chainAddressBook:
    | typeof AaveV3Sepolia
    | typeof AaveV3Ethereum
    | typeof AaveV3ScrollSepolia
    | typeof AaveV3Arbitrum
    | typeof AaveV3ArbitrumSepolia
    | typeof AaveV3Avalanche
    | typeof AaveV3Base
    | typeof AaveV3BaseSepolia
    | typeof AaveV3Fantom
    | typeof AaveV3FantomTestnet
    | typeof AaveV3Gnosis
    | typeof AaveV3Harmony
    | typeof AaveV3Fuji
    | typeof AaveV3Mumbai
    | typeof AaveV3Polygon
    | typeof AaveV3PolygonZkEvm
    | typeof AaveV3Optimism
    | typeof AaveV3OptimismSepolia
    | typeof AaveV3Scroll
    | typeof AaveV3ScrollSepolia;
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
  const chainAddressBook = useMemo(() => {
    switch (chainId) {
      //TODO: BNB ?
      case sepolia.id:
        return AaveV3Sepolia;
      case mainnet.id:
        return AaveV3Ethereum;
      case arbitrum.id:
        return AaveV3Arbitrum;
      case arbitrumSepolia.id:
        return AaveV3ArbitrumSepolia;
      case avalanche.id:
        return AaveV3Avalanche;
      case base.id:
        return AaveV3Base;
      case baseSepolia.id:
        return AaveV3BaseSepolia;
      case fantom.id:
        return AaveV3Fantom;
      case fantomTestnet.id:
        return AaveV3FantomTestnet;
      case gnosis.id:
        return AaveV3Gnosis;
      case harmonyOne.id:
        return AaveV3Harmony;
      case avalancheFuji.id:
        return AaveV3Fuji;
      //   case metis.id:
      //     return AaveV3Metis; // do not support WETH_GATEWAY
      case polygonMumbai.id:
        return AaveV3Mumbai;
      case polygon.id:
        return AaveV3Polygon;
      case polygonZkEvm.id:
        return AaveV3PolygonZkEvm;
      case optimism.id:
        return AaveV3Optimism;
      case optimismSepolia.id:
        return AaveV3OptimismSepolia;
      case scroll.id:
        return AaveV3Scroll;
      case scrollSepolia.id:
        return AaveV3ScrollSepolia;
      default:
        throw new Error("Chain not supported");
    }
  }, [chainId]);

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
