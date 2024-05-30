import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPWithdrawParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

/**
 *  Create withdraw txs for Aave V3 pool
 * @param pool  The pool contract
 * @param data  The data for the withdraw tx {@link LPWithdrawParamsType|LPWithdrawParamsType}
 * @returns  The withdraw txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createWithdrawTxs = async (
  pool: Pool,
  data: LPWithdrawParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.withdraw(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

/**
 *  Withdraws the underlying asset of an aToken asset.
 * @param signer the wallet client
 * @returns  the mutation object to withdraw an asset
 */
export const useWithdraw = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create withdraw txs for Aave V3 pool
   * @param data  The data for the withdraw tx {@link LPWithdrawParamsType|LPWithdrawParamsType}
   * @returns  An array of transaction hashes - `0x${string}[]`
   */
  const withdrawAsset = async (
    data: Omit<LPWithdrawParamsType, "user">
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const withdrawTxs = await createWithdrawTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!withdrawTxs) throw new Error("Withdraw transactions not found");
    const result = await submitTransaction({ signer, txs: withdrawTxs });
    return result;
  };

  return useMutation({
    mutationFn: withdrawAsset,
  });
};
