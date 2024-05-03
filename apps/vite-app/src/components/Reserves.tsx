import { useReserves } from "@aave/react-sdk";

export const Reserves = () => {
  const { data } = useReserves();
  console.log(data);
  return <></>;
};
