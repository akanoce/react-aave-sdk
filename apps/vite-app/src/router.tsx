import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Reserves } from "./pages/Reserves";
import { UserReserves } from "./pages/UserReserves";
import { Container } from "@chakra-ui/react";

export const ROUTES = {
  RESERVES: "/reserves",
  USER_RESERVES: "/user-reserves",
};
export const router = createBrowserRouter([
  {
    element: (
      <>
        <Navbar />
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to={ROUTES.RESERVES} replace={true} />,
      },
      {
        path: ROUTES.RESERVES,
        element: <Reserves />,
      },
      {
        path: ROUTES.USER_RESERVES,
        element: <UserReserves />,
      },
    ],
  },
]);
