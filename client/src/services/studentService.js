import apiClient from "./apiClient";

const studentService = {
  getStudents: async (token) => {
    const response = await apiClient.get("/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getStudentById: async (token, id) => {
    const response = await apiClient.get(`/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  createStudent: async (token, student) => {
    const response = await apiClient.post(
      "/students",
      student,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateStudent: async (token, id, student) => {
    const response = await apiClient.put(
      `/students/${id}`,
      student,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteStudent: async (token, id) => {
    const response = await apiClient.delete(
      `/students/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default studentService;