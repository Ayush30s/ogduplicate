import { toast } from "react-toastify";

const alert = (message, type = "info") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    style: {
      borderRadius: "8px",
      background: "#1f2937", // Tailwind gray-800
      color: "#ffffff",
      fontSize: "15px",
      padding: "12px 16px",
    },
  });
};

export default alert;
