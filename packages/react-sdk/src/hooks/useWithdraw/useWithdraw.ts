import { Pool, EthereumTransactionTypeExtended } from "@aave/contract-helpers";
// import { useQuery } from "@tanstack/react-query";
import {
  LPSignERC20ApprovalType,
  LPSupplyParamsType,
} from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import dayjs from "dayjs";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { submitTransaction } from "../../utils/sendTransaction";

export const createWithdrawTxs = async (
  pool: Pool,
  data: LPSupplyParamsType,
): Promise<EthereumTransactionTypeExtended[]> => {
  console.log("withdraw");
  const txs: EthereumTransactionTypeExtended[] = await pool.withdraw(data);
  return txs;
};

type Props = {
  signer: WalletClient;
};

type WithdrawAsset = {
  amount: string;
  reserve: string;
};

export const useWithdraw = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();
  const supplyAsset = async ({
    amount,
    reserve,
  }: WithdrawAsset): Promise<`0x${string}`[]> => {
    console.log("amount", amount);
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");
    const data: LPSignERC20ApprovalType = {
      amount,
      user: signer.account.address,
      reserve,
      deadline: dayjs().add(1, "day").unix().toString(),
    };
    const withdrawTxs = await createWithdrawTxs(poolContract, data);
    if (!withdrawTxs) throw new Error("Supply transactions not found");
    const result = await submitTransaction({ signer, txs: withdrawTxs });
    return result;
  };
  return useMutation({
    mutationFn: supplyAsset,
  });
};
