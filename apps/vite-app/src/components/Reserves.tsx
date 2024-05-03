import { useReserves } from "@aave/react-sdk";

export const Reserves = () => {
  const reserves = useReserves();

  console.log(reserves);
  return <></>;
};
