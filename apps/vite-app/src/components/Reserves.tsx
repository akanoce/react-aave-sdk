import { useReserves } from "@aave/react-sdk";
import { Card, CardHeader, Heading, Spinner } from "@chakra-ui/react";
import { ReservesTable } from "@repo/components";

export const Reserves = () => {
  const { data: reserves, isLoading: reservesLoading } = useReserves();

  if (reservesLoading) return;
  <Card w="full">
    <CardHeader>
      <Heading size="md">Aave V3 Reserves</Heading>
    </CardHeader>
    <Spinner />
  </Card>;

  if (!reserves) return null;

  return (
    <Card w="full">
      <CardHeader>
        <Heading size="md">Aave V3 Reserves</Heading>
      </CardHeader>
      <ReservesTable
        formattedReserves={reserves.formattedReserves}
        tableCaption="Aave V3 Reserves"
      />
    </Card>
  );
};
