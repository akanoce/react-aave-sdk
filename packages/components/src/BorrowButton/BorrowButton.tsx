import { useCallback, useMemo, useState } from "react";
import {
  GetReservesResponse,
  GetUserReservesResponse,
  useBorrow,
} from "@aave/react-sdk";
import {
  Button,
  FormControl,
  FormHelperText,
  HStack,
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
import { BigNumber } from "bignumber.js";
import { WalletClient } from "viem";

type Props = {
  reserve: GetReservesResponse["formattedReserves"][number];
  formattedUserSummary?: GetUserReservesResponse["formattedReserves"];
  signer: WalletClient;
};

export const BorrowButton: React.FC<Props> = ({
  reserve,
  formattedUserSummary,
  signer,
}) => {
  const availableToBorrowUsd = new BigNumber(
    formattedUserSummary?.availableBorrowsUSD ?? 0
  );
  const reservePriceInUsd = new BigNumber(reserve.priceInUSD ?? 0);
  const availableToBorrowInReserve = useMemo(() => {
    if (!availableToBorrowUsd || !reservePriceInUsd) return 0;
    return availableToBorrowUsd.div(reservePriceInUsd);
  }, [availableToBorrowUsd, reservePriceInUsd]);

  const [amount, setAmount] = useState("0");

  //TODO: support onBehalfOf
  const borrowMutation = useBorrow({ signer });

  const onBorrow = useCallback(async () => {
    if (!amount) return;
    await borrowMutation.mutateAsync({
      amount,
      reserve: reserve.underlyingAsset,
    });
  }, [amount, borrowMutation, reserve]);

  const isLoading = borrowMutation.isPending;

  const isDisabled =
    !Number(amount) ||
    isLoading ||
    Number(amount) > Number(availableToBorrowInReserve) ||
    Number(amount) <= 0;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          colorScheme="orange"
          variant="outline"
          size="sm"
          isDisabled={
            !availableToBorrowInReserve || availableToBorrowInReserve.isZero()
          }
        >
          Borrow
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
                <Button
                  variant="link"
                  onClick={() =>
                    setAmount(availableToBorrowInReserve.toString())
                  }
                >
                  Use Max: =~
                  {availableToBorrowInReserve.toFixed(2)}
                </Button>
              </FormHelperText>
            </FormControl>
          </PopoverBody>
          <PopoverFooter>
            <HStack spacing={4}>
              <Button
                isDisabled={isDisabled}
                size="sm"
                alignSelf={"flex-end"}
                colorScheme="purple"
                isLoading={isLoading}
                onClick={onBorrow}
              >
                Borrow
              </Button>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
