import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPRepayWithPermitParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

/**
 *  Create repay txs for Aave V3 pool
 * @param pool  The pool contract
 * @param data  The data for the repay tx {@link LPRepayWithPermitParamsType|LPRepayWithPermitParamsType}
 * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createRepayWithPermitTxs = async (
  pool: Pool,
  data: LPRepayWithPermitParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] =
    await pool.supplyWithPermit(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

/**
 * Same underlying method as repay but uses a signature based approval passed as a parameter.
 * @param signer the wallet client
 * @returns the mutation object to repay an asset
 */
export const useRepayWithPermit = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create repay txs for Aave V3 pool
   * @param data  The data for the repay tx {@link LPRepayWithPermitParamsType|LPRepayWithPermitParamsType}
   * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
   */
  const repayWithPermit = async (
    data: Omit<LPRepayWithPermitParamsType, "user">
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const withdrawTxs = await createRepayWithPermitTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!withdrawTxs) throw new Error("RepayWithPermit transactions not found");
    const result = await submitTransaction({ signer, txs: withdrawTxs });
    return result;
  };
  return useMutation({
    mutationFn: repayWithPermit,
  });
};
