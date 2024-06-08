import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import { LPRepayWithPermitParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";
import { useSignERC20Approval } from "../useSignERC20Approval/useSignERC20Approval";

/**
 *  Create repay txs for Aave V3 pool
 * @param pool  The pool contract
 * @param data  The data for the repay tx {@link LPRepayWithPermitParamsType|LPRepayWithPermitParamsType}
 * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
 */
export const createRepayWithPermitTxs = async (
  pool: Pool,
  data: LPRepayWithPermitParamsType,
): Promise<EthereumTransactionTypeExtended[]> => {
  const txs: EthereumTransactionTypeExtended[] =
    await pool.repayWithPermit(data);
  return txs;
};

type RepayData = Omit<
  LPRepayWithPermitParamsType,
  "user" | "interestRateMode" | "deadline"
> & {
  interestRateMode?: InterestRate;
  deadline?: string;
};

type Props = {
  signer: WalletClient;
};

/**
 * Same underlying method as repay but uses a signature based approval passed as a parameter.
 * @param signer the wallet client
 * @returns the mutation object to repay an asset
 * @example
 * ```tsx
 * const { mutate } = useRepayWithPermit({ signer });
 * mutate(
 * {
 * reserve: "0xReserveAddress", // The ethereum address of the reserve (underlyingAsset)
 * amount: "2.5", // The human readable (i.e 2.5) amount to repay, or (-1) if the user wants to repay everything
 * signature: "0xSignature", // The ERC20 signature of the permit (to be generated using {@link useSignERC20Approval})
 * onBehalfOf?: "0xOtherAddress",  // The ethereum address for which user is swapping. It will default to the user address
 * interestRateMode?: InterestRate.Variable, // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid - defaults to variable
 * deadline?: 0, // Expiration of signature in seconds, defaults to 1 day
 * },
 * );
 * ```
 */
export const useRepayWithPermit = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  /**
   *  Create repay txs for Aave V3 pool
   * @param data  The data for the repay tx {@link RepayData|RepayData}
   * @returns  The repay txs - {@link EthereumTransactionTypeExtended|EthereumTransactionTypeExtended[]}
   */
  const repayWithPermit = async ({
    interestRateMode = InterestRate.Variable,
    deadline = dayjs().add(1, "day").unix().toString(),
    ...data
  }: RepayData): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const withdrawTxs = await createRepayWithPermitTxs(poolContract, {
      ...data,
      interestRateMode,
      deadline,
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
