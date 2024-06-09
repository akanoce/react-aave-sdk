import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import { LPRepayParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "@/providers";
import { submitTransaction } from "@/utils/sendTransaction";

/**
 *  Create repay txs for Aave V3 pool
 * @param pool  The pool contract
 * @param data  The data for the repay tx {@link LPRepayParamsType|LPRepayParamsType}
 * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createRepayTxs = async (
  pool: Pool,
  data: LPRepayParamsType,
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.repay(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

type RepayData = Omit<LPRepayParamsType, "user" | "interestRateMode"> & {
  interestRateMode?: InterestRate;
};
/**
 * Repays a borrow on the specific reserve, for the specified amount (or for the whole amount, if (-1) is specified).
 * the target user is defined by onBehalfOf.
 * If there is no repayment on behalf of another account, onBehalfOf must be equal to user
 *
 * If the Pool is not approved to spend user funds, an approval transaction will also be returned
 * @param signer the wallet client
 * @returns the mutation object to repay an asset
 * @example
 * ```tsx
 * const { mutate } = useRepay({ signer });
 * mutate(
 *  {
 *   reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 *   amount: "2.5", // The human readable (i.e 2.5) amount to repay, or (-1) if the user wants to repay everything
 *   Optional?: onBehalfOf: "0xOtherAddress",  // The ethereum address for which user is swapping. It will default to the user address
 *   Optional?: interestRateMode: InterestRate.Variable, // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid - defaults to variable
 * },
 * );
 * ```
 */
export const useRepay = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create repay txs for Aave V3 pool
   * @param data  The data for the repay tx {@link LPRepayParamsType|LPRepayParamsType}
   * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
   */
  const repayAsset = async ({
    interestRateMode = InterestRate.Variable,
    ...data
  }: RepayData): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const withdrawTxs = await createRepayTxs(poolContract, {
      ...data,
      interestRateMode,
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
