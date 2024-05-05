import { Select } from "@chakra-ui/react";
import { supportedNetworks } from "@aave/react-sdk";
import { useSelectedNetwork } from "../store";
import { ChangeEvent, useCallback } from "react";
export const NetworkSelect = () => {
  const { chainId, setChainId } = useSelectedNetwork();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setChainId(Number(e.target.value));
    },
    [setChainId]
  );
  return (
    <Select placeholder="Select Network" value={chainId} onChange={onChange}>
      {supportedNetworks.map((network) => (
        <option key={network.id} value={network.id}>
          {network.name}
        </option>
      ))}
    </Select>
  );
};
