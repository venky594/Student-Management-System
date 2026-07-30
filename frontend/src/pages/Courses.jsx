import { useEffect, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", code: "", department: "", durationYears: 4 };

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    const { data } = await axiosClient.get("/courses");
    setCourses(data);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosClient.post("/courses", form);
      setForm(emptyForm);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axiosClient.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Courses</h2>
      </div>

      {user?.role === "admin" && (
        <form className="inline-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <input
            name="name"
            placeholder="Course name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="code"
            placeholder="Code (e.g. CS101)"
            value={form.code}
            onChange={handleChange}
            required
          />
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="durationYears"
            placeholder="Years"
            min="1"
            max="8"
            value={form.durationYears}
            onChange={handleChange}
          />
          <button className="btn btn-primary" disabled={loading}>
            Add Course
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Duration</th>
            {user?.role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.code}</td>
              <td>{c.name}</td>
              <td>{c.department}</td>
              <td>{c.durationYears} yr(s)</td>
              {user?.role === "admin" && (
                <td>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(c._id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan="5" className="empty-row">
                No courses yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
