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

type BorrowAssetProps = {
  amount: string;
  reserve: string;
  onBehalfOf?: string;
  interestRateMode?: InterestRate;
};

/**
 * hook to borrow an asset from the an aave v3 pool
 * @param signer the wallet client
 * @returns the mutation object to borrow an asset
 */
export const useBorrow = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Borrow an asset from the pool to an aave v3 pool
   * @param amount - The amount to be borrowed
   * @param reserve - The ethereum address of the reserve
   * @param onBehalfOf - The ethereum address for which user is borrowing. It will default to the user address
   * @param interestRateMode - The interest rate mode at which the user wants to borrow - default is variable
   * @returns  An array of transaction hashes - `0x${string}[]`
   */
  const borrowAsset = async ({
    amount,
    reserve,
    onBehalfOf,
    interestRateMode = InterestRate.Variable,
  }: BorrowAssetProps): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");
    const data: LPBorrowParamsType = {
      amount: amount,
      user: signer.account.address,
      reserve,
      onBehalfOf,
      interestRateMode,
    };
    const supplyTxs = await createBorrowTx(poolContract, data);
    if (!supplyTxs) throw new Error("Borrow transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };

  return useMutation({
    mutationFn: borrowAsset,
  });
};
