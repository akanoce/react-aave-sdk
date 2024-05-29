import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import { Container, HStack } from "@chakra-ui/react";
import { Navbar } from "./components/Navbar";
import { Reserves } from "./pages/Reserves";
import { UserReserves } from "./pages/UserReserves";
import { DesktopSidebar } from "./components/Sidebar/DesktopSidebar";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    element: (
      <>
        <Navbar />
        <Container maxW={["container.3xl", "container.2xl", "container.xl"]}>
          <HStack spacing={4} py={4} w="full" align="stretch">
            <DesktopSidebar />
            <Outlet />
          </HStack>
        </Container>
      </>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to={ROUTES.RESERVES} replace />,
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
