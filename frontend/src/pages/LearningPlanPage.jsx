import React, { useEffect, useState } from "react";
import {
  getAllPlans,
  getPlansByStatus,
  searchPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/learningApi";
import "./LearningPlansPage.css";

const LearningPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetCompletionDate: "",
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const data = await getAllPlans();
    setPlans(data);
  };

  const handleSearch = async () => {
    const results = await searchPlans(search);
    setPlans(results);
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    const results = await getPlansByStatus(status);
    setPlans(results);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updatePlan(editId, form);
    } else {
      await createPlan(form);
    }
    setForm({ title: "", description: "", targetCompletionDate: "" });
    setEditId(null);
    fetchPlans();
  };

  const handleEdit = (plan) => {
    setForm(plan);
    setEditId(plan.id);
  };

  const handleDelete = async (id) => {
    await deletePlan(id);
    fetchPlans();
  };

  return (
    <div className="container">
      <h1>📘 Learning Plans</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select
          onChange={(e) => handleStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="">Filter by Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.targetCompletionDate}
          onChange={(e) =>
            setForm({ ...form, targetCompletionDate: e.target.value })
          }
          required
        />
        <button type="submit">{editId ? "Update" : "Create"} Plan</button>
      </form>

      <div className="plan-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <p>
              <strong>Target:</strong>{" "}
              {new Date(plan.targetCompletionDate).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {plan.status}
            </p>
            <button onClick={() => handleEdit(plan)}>Edit</button>
            <button onClick={() => handleDelete(plan.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlansPage;
