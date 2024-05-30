import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPRepayParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

/**
 *  Create repay txs for Aave V3 pool
 * @param pool  The pool contract
 * @param data  The data for the repay tx {@link LPRepayParamsType|LPRepayParamsType}
 * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createRepayTxs = async (
  pool: Pool,
  data: LPRepayParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.repay(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

/**
 * Repays a borrow on the specific reserve, for the specified amount (or for the whole amount, if (-1) is specified).
 * the target user is defined by onBehalfOf.
 * If there is no repayment on behalf of another account, onBehalfOf must be equal to user
 *
 * If the Pool is not approved to spend user funds, an approval transaction will also be returned
 * @param signer the wallet client
 * @returns the mutation object to repay an asset
 */
export const useRepay = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create repay txs for Aave V3 pool
   * @param data  The data for the repay tx {@link LPRepayParamsType|LPRepayParamsType}
   * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
   */
  const repayAsset = async (
    data: Omit<LPRepayParamsType, "user">
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const withdrawTxs = await createRepayTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!withdrawTxs) throw new Error("Repay transactions not found");
    const result = await submitTransaction({ signer, txs: withdrawTxs });
    return result;
  };
  return useMutation({
    mutationFn: repayAsset,
  });
};
