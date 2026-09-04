import apiClient from "./apiClient";

const galleryService = {
  // Public gallery
  getPublicGallery: async () => {
    const response = await apiClient.get("/gallery");
    return response.data;
  },

  // Admin gallery
  getAdminGallery: async (token) => {
    const response = await apiClient.get("/gallery/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Get one gallery item
  getGalleryItem: async (token, id) => {
    const response = await apiClient.get(
      `/gallery/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Create gallery item
  // data can be FormData
  createGalleryItem: async (token, data) => {
    const response = await apiClient.post(
      "/gallery",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Update gallery item
  // data can be FormData
  updateGalleryItem: async (token, id, data) => {
    const response = await apiClient.put(
      `/gallery/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Delete gallery item
  deleteGalleryItem: async (token, id) => {
    const response = await apiClient.delete(
      `/gallery/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default galleryService;