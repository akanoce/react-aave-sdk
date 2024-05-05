import { useUserReserves } from "@aave/react-sdk";

const address = "0x5b11284aAc0bdc6dcc1bD00416A30C7f5997A60D";
export const UserReserves = () => {
  const userReserves = useUserReserves(address);
  console.log("userReserves", userReserves);
  return <></>;
};
