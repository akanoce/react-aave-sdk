import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import { LPSetUsageAsCollateral } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "@/providers";
import { submitTransaction } from "@/utils/sendTransaction";

/**
 *
 * @param pool  the pool contract
 * @param data  the data to set usage as collateral
 * @param data.user The ethereum address that will make the deposit
 * @param data.reserve The ethereum address of the reserve
 * @param data.usageAsCollateral Boolean, true if the user wants to use the deposit as collateral, false otherwise
 * @returns the set usage as collateral transactions - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createSetUsageAsCollateralTxs = async (
  pool: Pool,
  data: LPSetUsageAsCollateral,
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] =
    await pool.setUsageAsCollateral(data);
  return txs;
};

type SetUsageAsCollateralData = Omit<LPSetUsageAsCollateral, "user">;

type Props = {
  signer: WalletClient;
};

/**
 * hook to allow depositors to enable or disable a specific deposit as collateral
 * @param signer the wallet client
 * @returns the mutation object to enable or disable a specific deposit as collateral
 * @example
 * ```tsx
 * const { mutate } = useSetUsageAsCollateral({ signer });
 * mutate(
 * {
 * reserve: "0xReserveAddress", // The ethereum address of the reserve
 * usageAsCollateral: true, // Boolean, true if the user wants to use the deposit as collateral, false otherwise
 * },
 * );
 * ```
 */
export const useSetUsageAsCollateral = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *
   * @param pool  the pool contract
   * @param data  the data to set usage as collateral
   * @param data.reserve The ethereum address of the reserve
   * @param data.usageAsCollateral Boolean, true if the user wants to use the deposit as collateral, false otherwise
   * @returns the transactions hashes - `0x${string}[]`
   */

  const setUsageAsCollateral = async (
    data: SetUsageAsCollateralData,
  ): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const supplyTxs = await createSetUsageAsCollateralTxs(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!supplyTxs)
      throw new Error("SetUsageAsCollateral transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };
  return useMutation({
    mutationFn: setUsageAsCollateral,
  });
};
