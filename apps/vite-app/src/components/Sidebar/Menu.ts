export type MenuEntry = {
  title: string;
  icon?: string;
  route: string;
};

export const Menu: MenuEntry[] = [
  {
    title: "useReserves",
    route: "/reserves",
  },
  {
    title: "useUserReserves",
    route: "/user-reserves",
  },
];
