import { supportedNetworks } from "@aave/react-sdk";
import { http, createConfig } from "wagmi";
import { Chain } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    // TODO: IS there a better type for this?
    appName: "Next/AAVE react sdk sample app",
    chains: supportedNetworks as unknown as readonly [Chain, ...Chain[]],
    walletConnectProjectId: "PROJECT_ID",
    transports: supportedNetworks.reduce(
      (acc, network) => {
        acc[network.id] = http();
        return acc;
      },
      {} as Record<number, ReturnType<typeof http>>,
    ),
  }),
);
