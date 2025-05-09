import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/job-posts"; // Update this if needed

const getAllJobs = () => axios.get(`${API_URL}/all`);
const getJobById = (id) =>
  axios.get(`${API_URL}/${id}`).then((res) => res.data);
const createJob = (jobData) => axios.post(API_URL, jobData);
const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);
const deleteJob = (id) => axios.delete(`${API_URL}/${id}`);

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
