import apiClient from "./apiClient";

const teacherService = {
  getTeachers: async (token) => {
    const response = await apiClient.get(
      "/teachers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  getTeacher: async (token, id) => {
    const response = await apiClient.get(
      `/teachers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  createTeacher: async (
    token,
    formData
  ) => {
    const response = await apiClient.post(
      "/teachers",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateTeacher: async (
    token,
    id,
    formData
  ) => {
    const response = await apiClient.put(
      `/teachers/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteTeacher: async (token, id) => {
    const response = await apiClient.delete(
      `/teachers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default teacherService;