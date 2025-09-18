import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import Product from "./components/Product";

export function App() {
  return (
    <div>
      <Product></Product>
    </div>
  );
}
