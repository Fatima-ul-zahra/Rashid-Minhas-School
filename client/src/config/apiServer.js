const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export default API_SERVER_URL;