import apiClient from "./apiClient";

const admissionService = {
  getAdmissions: async (token) => {
    const response = await apiClient.get("/admissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getAdmission: async (token, id) => {
    const response = await apiClient.get(
      `/admissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  createAdmission: async (data) => {
    const response = await apiClient.post(
      "/admissions",
      data
    );

    return response.data;
  },

  updateAdmission: async (token, id, data) => {
    const response = await apiClient.put(
      `/admissions/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteAdmission: async (token, id) => {
    const response = await apiClient.delete(
      `/admissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default admissionService;