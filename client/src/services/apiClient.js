import axios from "axios";

import API_BASE_URL from "../config/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // Do not force JSON when sending FormData.
    // The browser must set multipart/form-data
    // together with its boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;