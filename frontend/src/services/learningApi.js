import axios from "axios";

const API_BASE = "http://localhost:8085/api/learning-plans";

export const getAllPlans = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getPlanById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const createPlan = async (plan) => {
  const res = await axios.post(API_BASE, plan);
  return res.data;
};

export const updatePlan = async (id, plan) => {
  const res = await axios.put(`${API_BASE}/${id}`, plan);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const getPlansByStatus = async (status) => {
  const res = await axios.get(`${API_BASE}/status/${status}`);
  return res.data;
};

export const searchPlans = async (title) => {
  const res = await axios.get(`${API_BASE}/search?title=${title}`);
  return res.data;
};
