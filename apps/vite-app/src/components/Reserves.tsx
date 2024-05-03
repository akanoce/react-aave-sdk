import { useReserves } from "@aave/react-sdk";

export const Reserves = () => {
  const reserves = useReserves();

  console.log("r", reserves);
  return <></>;
};
