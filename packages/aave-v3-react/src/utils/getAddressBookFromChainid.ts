import {
  AaveV3Sepolia,
  AaveV3Ethereum,
  AaveV3Arbitrum,
  AaveV3ArbitrumSepolia,
  AaveV3Avalanche,
  AaveV3Base,
  AaveV3BaseSepolia,
  AaveV3Linea,
  AaveV3Mantle,
  AaveV3ZkSync,
  AaveV3Gnosis,
  AaveV3BNB,
  AaveV3Polygon,
  AaveV3Optimism,
  AaveV3OptimismSepolia,
  AaveV3Scroll,
  AaveV3ScrollSepolia,
} from "@bgd-labs/aave-address-book";
import {
  sepolia,
  mainnet,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  bsc,
  baseSepolia,
  fantom,
  fantomTestnet,
  gnosis,
  harmonyOne,
  avalancheFuji,
  polygonMumbai,
  polygon,
  polygonZkEvm,
  optimism,
  optimismSepolia,
  scrollSepolia,
  scroll,
  linea,
  mantle,
  zksync,
} from "viem/chains";
// TODO: Sonic not exported by viem

export const supportedNetworks = [
  sepolia,
  mainnet,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  baseSepolia,
  fantom,
  fantomTestnet,
  gnosis,
  harmonyOne,
  avalancheFuji,
  polygonMumbai,
  polygon,
  polygonZkEvm,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  bsc,
  linea,
  mantle,
];

export const getAddressBookFromChainid = (chainId: number) => {
  switch (chainId) {
    case bsc.id:
      return AaveV3BNB;
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
    case gnosis.id:
      return AaveV3Gnosis;
    // case avalancheFuji.id:
    //   return AaveV3Fuji; // do not support UI_POOL_DATA_PROVIDER
    //   case metis.id:
    //     return AaveV3Metis; // do not support WETH_GATEWAY
    case polygon.id:
      return AaveV3Polygon;
    case optimism.id:
      return AaveV3Optimism;
    case optimismSepolia.id:
      return AaveV3OptimismSepolia;
    case scroll.id:
      return AaveV3Scroll;
    case scrollSepolia.id:
      return AaveV3ScrollSepolia;
    // case sonic.id:
    //   return AaveV3Sonic;
    // TODO: Add sonic
    case linea.id:
      return AaveV3Linea;
    case mantle.id:
      return AaveV3Mantle;
    // case celo.id:
    //   return AaveV3Celo; // do not support WETH_GATEWAY
    case zksync.id:
      return AaveV3ZkSync;
    default:
      throw new Error("Chain not supported");
  }
};

export type SupportedAddressBook = ReturnType<typeof getAddressBookFromChainid>;
export type SupportedChainIds = (typeof supportedNetworks)[number]["id"];
