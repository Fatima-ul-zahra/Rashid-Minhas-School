import apiClient from "./apiClient";

const feeService = {
  // Get all fees
  getFees: async (token, filters = {}) => {
    const response = await apiClient.get("/fees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });

    return response.data;
  },

  // Get single fee
  getFeeById: async (token, id) => {
    const response = await apiClient.get(`/fees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Get all fees of one student
  getStudentFees: async (token, studentId) => {
    const response = await apiClient.get(
      `/fees/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Create fee
  createFee: async (token, feeData) => {
    const response = await apiClient.post(
      "/fees",
      feeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Update fee
  updateFee: async (token, id, feeData) => {
    const response = await apiClient.put(
      `/fees/${id}`,
      feeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Delete fee
  deleteFee: async (token, id) => {
    const response = await apiClient.delete(
      `/fees/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default feeService;