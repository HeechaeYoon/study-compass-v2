import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/700.css";
import "@fontsource/gowun-dodum/korean-400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
