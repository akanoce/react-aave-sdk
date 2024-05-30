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
 * @param data.reserve The ethereum address of the reserve
 * @param data.amount The amount to be withdrawn
 * @returns  The withdraw txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 * @example
 * ```ts
 * const txs = await createWithdrawTxs(poolContract, {
 * reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 * amount: "2.5", // The human readable (i.e 2.5) amount to withdraw
 * });
 * ```
 */
export const createWithdrawTxs = async (
  pool: Pool,
  data: LPWithdrawParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.withdraw(data);
  return txs;
};

type WithdrawData = Omit<LPWithdrawParamsType, "user">;
type Props = {
  signer: WalletClient;
};

/**
 *  Withdraws the underlying asset of an aToken asset.
 * @param signer the wallet client
 * @returns  the mutation object to withdraw an asset
 * @example
 * ```tsx
 * const { mutate } = useWithdraw({ signer });
 * mutate(
 *  {
 *  reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 *  amount: "2.5", // The human readable (i.e 2.5) amount to withdraw
 *  onBehalfOf: "0xOtherAddress", // The ethereum address for which user is swapping. It will default to the user address
 * },
 * );
 * ```
 */
export const useWithdraw = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create withdraw txs for Aave V3 pool
   * @param data  The data for the withdraw tx {@link LPWithdrawParamsType|LPWithdrawParamsType}
   * @returns  An array of transaction hashes - `0x${string}[]`
   */
  const withdrawAsset = async (
    data: WithdrawData
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
