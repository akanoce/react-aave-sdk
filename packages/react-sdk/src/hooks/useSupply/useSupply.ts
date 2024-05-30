import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPSupplyParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

/**
 * Supply an asset to the pool
 * @param pool the pool contract
 * @param data the data to supply an asset
 * @param data.reserve The ethereum address of the reserve
 * @param data.amount The amount to be deposited
 * @param [data.onBehalfOf] The ethereum address for which user is depositing. It will default to the user address
 * @returns the supply transactions - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 * @example
 * ```ts
 * const txs = await createSupplyTxs(poolContract, {
 *  reserve: "0xReserveAddress",
 * amount: "1000000000000000000", // 1 ETH in wei
 * // Optional: onBehalfOf: "0xOtherAddress",
 * });
 * ```
 */
export const createSupplyTxs = async (
  pool: Pool,
  data: LPSupplyParamsType
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] = await pool.supply(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

/**
 * hook to supply an asset to the pool to an aave v3 pool
 * Formerly `deposit`, supply the underlying asset into the Pool reserve. For every
 * token that is supplied, a corresponding amount of aTokens is minted
 * @param signer the wallet client
 * @returns the mutation object to supply an asset
 * @example
 * ```tsx
 * const { mutate } = useSupply({ signer });
 *
 * mutate(
 *   {
 *     reserve: "0xReserveAddress",
 *     amount: "1000000000000000000", // 1 ETH in wei
 *     // Optional: onBehalfOf: "0xOtherAddress",
 *   },
 * );
 * ```
 */
export const useSupply = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   * Supply an asset to the pool
   * @param data the data to supply an asset
   * @param data.reserve The ethereum address of the reserve
   * @param data.amount The amount to be deposited
   * @param [data.onBehalfOf] The ethereum address for which user is depositing. It will default to the user address
   * @returns the transactions hashes - `0x${string}[]`
   */
  const supplyAsset = async (
    data: Omit<LPSupplyParamsType, "user">
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const supplyTxs = await createSupplyTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!supplyTxs) throw new Error("Supply transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };
  return useMutation({
    mutationFn: supplyAsset,
  });
};
