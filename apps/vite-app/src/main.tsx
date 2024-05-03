import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ChakraProvider, Container } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Container maxW="container.xl">
        <App />
      </Container>
    </ChakraProvider>
  </React.StrictMode>
);
