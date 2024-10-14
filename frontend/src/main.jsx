import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {Provider} from "react-redux"
import store from "../src/redux/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
