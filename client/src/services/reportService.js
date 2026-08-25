import apiClient from "./apiClient";

const reportService = {
  getAttendanceReport: async (token, params = {}) => {
    const response = await apiClient.get(
      "/reports/attendance",
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getStudentAttendanceReport: async (
    token,
    studentId
  ) => {
    const response = await apiClient.get(
      `/reports/attendance/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default reportService;