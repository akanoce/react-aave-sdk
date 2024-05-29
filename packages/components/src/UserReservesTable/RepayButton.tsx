import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRepay } from "@aave/react-sdk";
import { WalletClient } from "viem";

type Props = {
  maxAmount: string;
  reserveAddress: string;
  signer: WalletClient;
};
export const RepayButton: React.FC<Props> = ({
  maxAmount,
  reserveAddress,
  signer,
}) => {
  const [amount, setAmount] = useState("0");
  const repayMutation = useRepay({ signer });

  const isLoading = repayMutation.isPending;

  const isDisabled =
    !Number(amount) ||
    isLoading ||
    Number(amount) > Number(maxAmount) ||
    Number(amount) <= 0;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          isDisabled={!maxAmount || maxAmount === "0"}
        >
          Repay
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Amount</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <FormControl id="amount">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <FormHelperText>
                <Button variant="link" onClick={() => setAmount(maxAmount)}>
                  Use Max: {maxAmount}
                </Button>
              </FormHelperText>
            </FormControl>
          </PopoverBody>
          <PopoverFooter>
            <Button
              isDisabled={isDisabled}
              size="sm"
              alignSelf="flex-end"
              colorScheme="purple"
              isLoading={isLoading}
              onClick={() =>
                repayMutation.mutate({ amount, reserve: reserveAddress })
              }
            >
              Confirm
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
