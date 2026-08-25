import apiClient from "./apiClient";

const dashboardService = {
  getStats: async (token) => {
    const response = await apiClient.get(
      "/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default dashboardService;