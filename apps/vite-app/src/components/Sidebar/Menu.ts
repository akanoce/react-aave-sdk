import { ROUTES } from "../../routes";

export type MenuEntry = {
  title: string;
  icon?: string;
  route: string;
};

export const Menu: MenuEntry[] = [
  {
    title: "useReserves",
    route: ROUTES.RESERVES,
  },
  {
    title: "useUserReserves",
    route: ROUTES.USER_RESERVES,
  },
];
