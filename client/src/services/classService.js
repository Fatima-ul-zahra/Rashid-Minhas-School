import apiClient from "./apiClient";

const classService = {
  getClasses: async (token) => {
    const response = await apiClient.get("/classes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getClassById: async (token, id) => {
    const response = await apiClient.get(`/classes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  createClass: async (token, classData) => {
    const response = await apiClient.post(
      "/classes",
      classData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateClass: async (token, id, classData) => {
    const response = await apiClient.put(
      `/classes/${id}`,
      classData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteClass: async (token, id) => {
    const response = await apiClient.delete(
      `/classes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default classService;