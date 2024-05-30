import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
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

type SupplyData = Omit<LPSupplyParamsType, "user" | "interestRateMode"> & {
  interestRateMode?: InterestRate;
};

type Props = {
  signer: WalletClient;
};

/**
 * hook to supply an asset to the pool to an aave v3 pool
 * Formerly `deposit`, supply the underlying asset into the Pool reserve. For every
 * token that is supplied, a corresponding amount of aTokens is minted
 * It will create an approval transaction if the pool is not approved to spend user funds
 * @param signer the wallet client
 * @returns the mutation object to supply an asset
 * @example
 * ```tsx
 * const { mutate } = useSupply({ signer });
 *
 * mutate(
 *   {
 *     reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 *     amount: "2.5", // The human readable (i.e 2.5) amount to deposit
 *     // Optional: onBehalfOf: "0xOtherAddress", // The ethereum address for which user is swapping. It will default to the user address
 *     // Optional: referralCode: "0", Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
 *   },
 * );
 * ```
 */
export const useSupply = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   * Supply an asset to the pool
   * @param {LPSupplyParamsType} data the data to supply an asset
   * @param data.reserve The ethereum address of the reserve
   * @param data.amount The amount to be deposited
   * @param [data.onBehalfOf] The ethereum address for which user is depositing. It will default to the user address
   * @param [data.referralCode] Integrators are assigned a referral code and can potentially receive rewards. It defaults to 0 (no referrer)
   * @returns the transactions hashes - `0x${string}[]`
   */
  const supplyAsset = async (data: SupplyData): Promise<`0x${string}`[]> => {
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
