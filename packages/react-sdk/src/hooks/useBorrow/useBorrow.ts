import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import { LPBorrowParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

/**
 *  Create borrow txs for Aave V3 pool
 * @param provider
 * @param data  - The data for the borrow tx
 * @param data.pool - The pool contract
 * @param data.amount - The amount to be borrowed
 * @returns  The borrow txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createBorrowTx = async (
  pool: Pool,
  data: LPBorrowParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.borrow(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

type BorrowData = Omit<LPBorrowParamsType, "user" | "interestRateMode"> & {
  interestRateMode?: InterestRate;
};

/**
 * hook to borrow an asset from the an aave v3 pool
 * You must have a collateralized (i.e aTokens) asset to borrow an asset
 * @param signer the wallet client
 * @returns the mutation object to borrow an asset
 * @example
 * ```tsx
 * const { mutate } = useBorrow({ signer });
 * mutate(
 * {
 * reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 * amount: "2.5", // The human readable (i.e 2.5) amount to borrow
 * Optional: onBehalfOf?: "0xOtherAddress", //The ethereum address for which user is swapping. It will default to the user address
 * Optional: interestRateMode?: InterestRate.Variable, // The interest rate mode at which the user wants to borrow - default is variable
 * Optional: referralCode?: "0", Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
 * },
 * );
 * ```
 */
export const useBorrow = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Borrow an asset from the pool to an aave v3 pool
   * @param amount - The amount to be borrowed
   * @param reserve - The ethereum address of the reserve
   * @param [onBehalfOf] - The ethereum address for which user is borrowing. It will default to the user address
   * @param [interestRateMode] - The interest rate mode at which the user wants to borrow - default is variable
   * @param [referralCode] - Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
   * @returns  An array of transaction hashes - `0x${string}[]`
   */
  const borrowAsset = async ({
    interestRateMode = InterestRate.Variable,
    ...data
  }: BorrowData): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const supplyTxs = await createBorrowTx(poolContract, {
      ...data,
      user: signer.account.address,
      interestRateMode,
    });
    if (!supplyTxs) throw new Error("Borrow transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };

  return useMutation({
    mutationFn: borrowAsset,
  });
};
