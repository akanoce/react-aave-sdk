import { supportedNetworks } from "react-aave-v3";
import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { Chain } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "Vite/AAVE react sdk sample app",
    walletConnectProjectId: "PROJECT_ID",
    // TODO: IS there a better type for this?
    chains: supportedNetworks as unknown as readonly [Chain, ...Chain[]],
    transports: supportedNetworks.reduce(
      (acc, network) => {
        acc[network.id] = http();
        return acc;
      },
      {} as Record<number, ReturnType<typeof http>>,
    ),
  }),
);
