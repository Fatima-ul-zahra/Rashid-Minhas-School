import apiClient from "./apiClient";

const schoolSettingsService = {
  getSettings: async () => {
    const response = await apiClient.get("/settings");

    return response.data;
  },

  createSettings: async (settings) => {
    const response = await apiClient.post(
      "/settings",
      settings
    );

    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiClient.put(
      "/settings",
      settings
    );

    return response.data;
  },
};

export default schoolSettingsService;