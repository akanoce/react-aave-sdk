import { Pool } from "@aave/contract-helpers";
import { LPSignERC20ApprovalType } from "@aave/contract-helpers/dist/esm/v3-pool-contract/lendingPoolTypes";
import { WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useAaveContracts } from "../../providers/AaveContractsProvider";
import { ethers } from "ethers";

/**
 *  This method is used to generate the raw signature data to be signed by the user.
 *  Once generated, a function is called to trigger a signature request from the users wallet.
 *  This signature can be passed a parameter to {@link useSupplyWithPermit} or {@link useRepayWithPermit} in place of an approval transaction
 * @param pool  The pool contract
 * @param data  The data to sign for the ERC20 approval
 * @returns  The signature for the ERC20 approval
 */
export const createERC20ApprovaSignature = async (
  pool: Pool,
  data: LPSignERC20ApprovalType
): Promise<string> => {
  /*
- @param `user` The ethereum address that will make the deposit 
- @param `reserve` The ethereum address of the reserve 
- @param `amount` The amount to be deposited 
- @param `deadline` Expiration of signature in seconds, for example, 1 hour = Math.floor(Date.now() / 1000 + 3600).toString()
*/
  const dataToSign: string = await pool.signERC20Approval(data);
  return dataToSign;
};

type Props = {
  signer: WalletClient;
};

/**
 *  This method is used to generate the raw signature data to be signed by the user.
 *  Once generated, a function is called to trigger a signature request from the users wallet.
 *  This signature can be passed a parameter to {@link useSupplyWithPermit} or {@link useRepayWithPermit} in place of an approval transaction
 *
 *
 *  Note: Not all tokens are compatible with the ERC-2612 permit functionality.
 *  You can check the {@link https://github.com/aave/interface/blob/main/src/ui-config/permitConfig.ts} for an updated list of supported tokens by network.
 * @param signer The wallet client
 * @returns  The mutation object to sign the ERC20 approval
 */
export const useSignERC20Approval = ({ signer }: Props) => {
  const { poolContract } = useAaveContracts();

  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  /**
   * This method is used to generate the raw signature data to be signed by the user.
   * @param data  - The data to sign for the ERC20 approval {@link LPSignERC20ApprovalType|LPSignERC20ApprovalType}
   * @returns The signature for the ERC20 approval
   */
  const signERC20Approval = async (
    data: Omit<LPSignERC20ApprovalType, "user">
  ): Promise<string> => {
    if (!poolContract) throw new Error("Pool contract not found");

    if (!signer.account) throw new Error("Signer account not found");

    const dataToSign = await createERC20ApprovaSignature(poolContract, {
      ...data,
      user: signer.account.address,
    });
    if (!dataToSign) throw new Error("signature not found");
    const signature = await provider.send("eth_signTypedData_v4", [
      signer.account.address,
      dataToSign,
    ]);
    return signature;
  };
  return useMutation({
    mutationFn: signERC20Approval,
  });
};
