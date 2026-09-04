import apiClient from "./apiClient";

const announcementService = {
  getPublicAnnouncements: async () => {
    const response = await apiClient.get("/announcements");
    return response.data;
  },

  getAdminAnnouncements: async (token) => {
    const response = await apiClient.get("/announcements/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getAnnouncement: async (token, id) => {
    const response = await apiClient.get(`/announcements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  createAnnouncement: async (token, data) => {
    const response = await apiClient.post(
      "/announcements",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateAnnouncement: async (token, id, data) => {
    const response = await apiClient.put(
      `/announcements/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteAnnouncement: async (token, id) => {
    const response = await apiClient.delete(
      `/announcements/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default announcementService;