import apiClient from "./apiClient";

const attendanceService = {
  getStudents: async (token, classId) => {
    const response = await apiClient.get(
      `/attendance/students?classId=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getAttendance: async (token, params = {}) => {
    const query = new URLSearchParams(params).toString();

    const response = await apiClient.get(
      `/attendance?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  saveAttendance: async (token, attendanceData) => {
    const response = await apiClient.post(
      "/attendance",
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default attendanceService;