import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPSupplyWithPermitType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";
import { useSignERC20Approval } from "../useSignERC20Approval/useSignERC20Approval";

/**
 *  Create supply with permit txs for Aave V3 pool using the permit signature
 * @param pool  The pool contract
 * @param data  The data for the supply with permit tx
 * @returns  The supply with permit txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createSupplyWithPermitTxs = async (
  pool: Pool,
  data: LPSupplyWithPermitType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] =
    await pool.supplyWithPermit(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

/**
 * Same underlying method as supply but uses a signature based approval passed as a parameter.
 * The signature can be generated using {@link useSignERC20Approval|useSignERC20Approval} hook
 * @param signer the wallet client
 * @returns the mutation object to supply with permit an asset
 */
export const useSupplyWithPermit = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Supply an asset to the pool to an aave v3 pool using a permit signature
   * @param data  - The data for the supply with permit tx {@link LPSupplyWithPermitType|LPSupplyWithPermitType}
   * @returns  An array of transaction hashes - `0x${string}[]`
   */
  const supplyWithPermit = async (
    data: Omit<LPSupplyWithPermitType, "user">
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const supplyTxs = await createSupplyWithPermitTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!supplyTxs) throw new Error("supplyWithPermit transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };
  return useMutation({
    mutationFn: supplyWithPermit,
  });
};
