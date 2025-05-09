import axios from "axios";

const API_URL = "http://localhost:8090/api/posts";

const getAllPosts = () => axios.get(`${API_URL}/`);
const getPostById = (id) =>
  axios.get(`${API_URL}/${id}`).then((res) => res.data);
const createJob = (jobData) => axios.post(API_URL, jobData);
const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);
const deleteJob = (id) => axios.delete(`${API_URL}/${id}`);

export default {
  getAllPosts,
  getPostById,
  createJob,
  updateJob,
  deleteJob,
};
