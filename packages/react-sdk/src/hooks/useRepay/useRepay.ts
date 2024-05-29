import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import { LPRepayParamsType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

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

type RepayAsset = {
  amount: string;
  reserve: string;
};

export const useRepay = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();
  const supplyAsset = async ({
    amount,
    reserve,
  }: RepayAsset): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");
    const data: LPRepayParamsType = {
      amount,
      user: signer.account.address,
      interestRateMode: InterestRate.Variable,
      reserve,
    };
    const withdrawTxs = await createRepayTxs(poolContract, data);
    if (!withdrawTxs) throw new Error("Supply transactions not found");
    const result = await submitTransaction({ signer, txs: withdrawTxs });
    return result;
  };
  return useMutation({
    mutationFn: supplyAsset,
  });
};
