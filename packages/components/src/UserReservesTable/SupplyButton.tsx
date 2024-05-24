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
import { useSupply } from "@aave/react-sdk";
import { WalletClient } from "viem";

type Props = {
  maxAmount: string;
  reserveAddress: string;
  signer: WalletClient;
};
export const SupplyButton: React.FC<Props> = ({
  maxAmount,
  reserveAddress,
  signer,
}) => {
  const [amount, setAmount] = useState("0");
  const supplyMutation = useSupply({ signer });

  const isLoading = supplyMutation.isPending;

  const isDisabled =
    !Number(amount) ||
    isLoading ||
    Number(amount) > Number(maxAmount) ||
    Number(amount) <= 0;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          isDisabled={!maxAmount || maxAmount === "0"}
        >
          Supply
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
                supplyMutation.mutate({ amount, reserve: reserveAddress })
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
