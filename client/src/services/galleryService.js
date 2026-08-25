import apiClient from "./apiClient";

const galleryService = {
  getPublicGallery: async () => {
    const response = await apiClient.get("/gallery");
    return response.data;
  },

  getAdminGallery: async (token) => {
    const response = await apiClient.get("/gallery/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getGalleryItem: async (token, id) => {
    const response = await apiClient.get(`/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

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