import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Toast
export const initToast = () => {
  toast.configure({
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
};

/*
 * Displays a toast message.
 * @param {string} type - The type of message ("success" or "error").
 * @param {string} message - The message to display.
 */
const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else {
    console.warn("Invalid toast type provided");
  }
};

export default showToast;
