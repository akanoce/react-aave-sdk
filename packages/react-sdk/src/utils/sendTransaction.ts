import { BigNumber } from "ethers";
import { EthereumTransactionTypeExtended } from "@aave/aave-utilities";
import { WalletClient } from "viem";

type SubmitTransactionParamsType = {
  signer: WalletClient;
  txs: EthereumTransactionTypeExtended[];
};
export const submitTransaction = async ({ signer, txs }: SubmitTransactionParamsType) => {
  const txResponses: `0x${string}`[] = [];
  await Promise.all(
    txs.map(async (tx) => {
      const extendedTxData = await tx.tx();
      const txData = extendedTxData;

      const txResponse = await signer.sendTransaction({
        ...txData,
        value: BigNumber.from(txData.value).toBigInt(),
      });

      txResponses.push(txResponse);
    })
  );
  return txResponses;
};
