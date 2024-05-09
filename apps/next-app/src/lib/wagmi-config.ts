import { supportedNetworks } from "@aave/react-sdk";
import { http, createConfig } from "wagmi";
import { Chain } from "wagmi/chains";

export const config = createConfig({
  // TODO: IS there a better type for this?
  chains: supportedNetworks as unknown as readonly [Chain, ...Chain[]],
  transports: supportedNetworks.reduce(
    (acc, network) => {
      acc[network.id] = http();
      return acc;
    },
    {} as Record<number, ReturnType<typeof http>>
  ),
});
