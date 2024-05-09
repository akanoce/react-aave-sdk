import { supportedNetworks } from "@aave/react-sdk";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultChainId =
  supportedNetworks.find((network) => network.name === "Sepolia")?.id || 1;
type SelectedNetworkStore = {
  chainId: number;
  setChainId: (chainId: number) => void;
};
export const useSelectedNetwork = create<SelectedNetworkStore>()(
  persist(
    (set) => ({
      chainId: defaultChainId,
      setChainId: (chainId: number) => set({ chainId }),
    }),
    {
      name: "SELECTED_NETWORK", // name of the item in the storage (must be unique)
    }
  )
);
