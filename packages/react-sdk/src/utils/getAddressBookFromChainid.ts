import {
  AaveV3Sepolia,
  AaveV3Ethereum,
  AaveV3Arbitrum,
  AaveV3ArbitrumSepolia,
  AaveV3Avalanche,
  AaveV3Base,
  AaveV3BaseSepolia,
  AaveV3Fantom,
  AaveV3FantomTestnet,
  AaveV3Gnosis,
  AaveV3Harmony,
  AaveV3Fuji,
  AaveV3Mumbai,
  AaveV3Polygon,
  AaveV3PolygonZkEvm,
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
} from "viem/chains";

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
];

export const getAddressBookFromChainid = (chainId: number) => {
  switch (chainId) {
    // TODO: BNB ?
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
};

export type SupportedAddressBook = ReturnType<typeof getAddressBookFromChainid>;
export type SupportedChainIds = (typeof supportedNetworks)[number]["id"];
