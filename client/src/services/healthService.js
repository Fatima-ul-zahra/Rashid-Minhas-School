import apiClient from "./apiClient";

const healthService = {
  checkHealth: async () => {
    const response = await apiClient.get("/health");

    return response.data;
  },
};

export default healthService;