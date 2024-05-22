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

type SupplyAssetProps = {
  amount: string;
  reserve: string;
};

/**
 * hook to supply an asset to the pool to an aave v3 pool
 * @param signer the wallet client
 * @returns the mutation object to supply an asset
 */
export const useSupply = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  const supplyAsset = async ({ amount, reserve }: SupplyAssetProps): Promise<`0x${string}`[]> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");
    const data: LPSignERC20ApprovalType = {
      amount,
      user: signer.account.address,
      reserve,
      deadline: dayjs().add(1, "day").unix().toString(),
    };
    const supplyTxs = await createSupplyTxs(poolContract, data);
    if (!supplyTxs) throw new Error("Supply transactions not found");
    const result = await submitTransaction({ signer, txs: supplyTxs });
    return result;
  };
  return useMutation({
    mutationFn: supplyAsset,
  });
};
