import apiClient from "./apiClient";

const studentDailyActivityService = {
  getActivities: async (token, studentId) => {
    const response = await apiClient.get(
      `/student-daily-activities/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  createActivity: async (
    token,
    studentId,
    formData
  ) => {
    const response = await apiClient.post(
      `/student-daily-activities/student/${studentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  deleteActivity: async (token, id) => {
    const response = await apiClient.delete(
      `/student-daily-activities/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default studentDailyActivityService;