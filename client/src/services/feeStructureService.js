import apiClient from "./apiClient";

const feeStructureService = {
  // Get all fee structures
  getFeeStructures: async (token, status = "") => {
    const response = await apiClient.get(
      "/fee-structures",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: status ? { status } : {},
      }
    );

    return response.data;
  },

  // Get single fee structure
  getFeeStructureById: async (token, id) => {
    const response = await apiClient.get(
      `/fee-structures/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Create fee structure
  createFeeStructure: async (token, structureData) => {
    const response = await apiClient.post(
      "/fee-structures",
      structureData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Update fee structure
  updateFeeStructure: async (
    token,
    id,
    structureData
  ) => {
    const response = await apiClient.put(
      `/fee-structures/${id}`,
      structureData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Delete fee structure
  deleteFeeStructure: async (token, id) => {
    const response = await apiClient.delete(
      `/fee-structures/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default feeStructureService;