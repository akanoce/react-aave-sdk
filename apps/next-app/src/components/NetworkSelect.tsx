import { ChangeEvent, useCallback } from "react";
import { Select } from "@chakra-ui/react";
import { supportedNetworks } from "aave-v3-react";
import { useSelectedNetwork } from "@/lib/store/useSelectedNetwork";

export const NetworkSelect = () => {
  const { chainId, setChainId } = useSelectedNetwork();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setChainId(Number(e.target.value));
    },
    [setChainId],
  );
  return (
    <Select value={chainId} onChange={onChange}>
      {supportedNetworks.map((network) => (
        <option key={network.id} value={network.id}>
          {network.name}
        </option>
      ))}
    </Select>
  );
};
