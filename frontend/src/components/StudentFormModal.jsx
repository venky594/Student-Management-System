import { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  rollNo: "",
  email: "",
  phone: "",
  dob: "",
  gender: "male",
  address: "",
  course: "",
  semester: 1,
  status: "active",
  guardianName: "",
  guardianPhone: "",
};

export default function StudentFormModal({ open, onClose, onSubmit, courses, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        course: initialData.course?._id || initialData.course || "",
        dob: initialData.dob ? initialData.dob.substring(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? "Edit Student" : "Add Student"}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div>
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Roll No.</label>
              <input name="rollNo" value={form.rollNo} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Course</label>
              <select name="course" value={form.course} onChange={handleChange} required>
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Semester</label>
              <input
                type="number"
                min="1"
                max="12"
                name="semester"
                value={form.semester}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
            <div>
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Guardian Name</label>
              <input name="guardianName" value={form.guardianName} onChange={handleChange} />
            </div>
            <div>
              <label>Guardian Phone</label>
              <input name="guardianPhone" value={form.guardianPhone} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
