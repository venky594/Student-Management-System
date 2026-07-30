import { useEffect, useState, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import StudentFormModal from "../components/StudentFormModal";
import { useAuth } from "../context/AuthContext";

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCourses = useCallback(async () => {
    const { data } = await axiosClient.get("/courses");
    setCourses(data);
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosClient.get("/students", {
        params: { search, page, limit: 8 },
      });
      setStudents(data.students);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const openAddModal = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditing(student);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    if (editing) {
      await axiosClient.put(`/students/${editing._id}`, form);
    } else {
      await axiosClient.post("/students", form);
    }
    setModalOpen(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axiosClient.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Students ({total})</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Student
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, roll no, or email..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.course?.name || "-"}</td>
                <td>{s.semester}</td>
                <td>
                  <span className={`badge badge-${s.status}`}>{s.status}</span>
                </td>
                <td className="actions">
                  <button className="btn btn-small" onClick={() => openEditModal(s)}>
                    Edit
                  </button>
                  {user?.role === "admin" && (
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-row">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      <StudentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        courses={courses}
        initialData={editing}
      />
    </div>
  );
}
