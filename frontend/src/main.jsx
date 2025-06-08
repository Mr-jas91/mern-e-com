import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {Provider} from "react-redux"
import store from "../src/redux/store.js";
import "./index.css";
import { BrowserRouter } from 'react-router-dom'; 

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </Provider>
);
