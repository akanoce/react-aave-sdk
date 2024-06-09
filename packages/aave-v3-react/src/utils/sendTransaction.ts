import { EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { BigNumber } from "ethers";
import { WalletClient } from "viem";

type SubmitTransactionParamsType = {
  signer: WalletClient;
  txs: EthereumTransactionTypeExtended[];
};
export const submitTransaction = async ({
  signer,
  txs,
}: SubmitTransactionParamsType) => {
  const txResponses: `0x${string}`[] = [];
  await Promise.all(
    txs.map(async (tx) => {
      const extendedTxData = await tx.tx();
      const txData = extendedTxData;

      // @ts-expect-error - TODO: check correct type for txData
      const txResponse = await signer.sendTransaction({
        ...txData,
        value: BigNumber.from(txData.value).toBigInt(),
      });

      txResponses.push(txResponse);
    }),
  );
  return txResponses;
};
