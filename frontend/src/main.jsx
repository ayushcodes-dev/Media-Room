import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Provider from "./provider.jsx";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
    
        <BrowserRouter>
          <App />
        </BrowserRouter>
 
    </Provider>
  </StrictMode>,
);
