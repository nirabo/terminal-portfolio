import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./components/styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import themes from "./components/styles/themes";
import { ConfigProvider } from "./ConfigContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <ThemeProvider theme={themes.dark}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>
);
