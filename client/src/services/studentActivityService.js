import apiClient from "./apiClient";

const studentActivityService = {
  getPublicActivities: async () => {
    const response = await apiClient.get(
      "/student-daily-activities/public"
    );

    return response.data;
  },
};

export default studentActivityService;