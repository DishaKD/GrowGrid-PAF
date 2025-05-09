import axios from "axios";

const API_URL = "http://localhost:8090/api/posts";

const getAllPosts = () => axios.get(`${API_URL}/`);

const getPostById = (id) =>
  axios.get(`${API_URL}/${id}`).then((res) => res.data);

const getPostsByUser = (userId) =>
  axios.get(`${API_URL}/user/${userId}`).then((res) => res.data);

const createPost = (formData) =>
  axios.post(`${API_URL}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const updatePost = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const deletePost = (id) => axios.delete(`${API_URL}/${id}`);

const uploadMediaFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
  uploadMediaFile,
};
