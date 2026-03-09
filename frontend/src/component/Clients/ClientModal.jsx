import { useState } from "react";
import styles from "./Clients.module.css";
import axios from "axios";

export default function ClientModal({ isOpen, onClose, client, onSave }) {
  const [formData, setFormData] = useState({
    firstname: client?.firstname || "",
    lastname: client?.lastname || "",
    email: client?.email || "",
    phone: client?.phone || "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }
      const payload = formData;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // edit
      if (client) {
        const { data } = await axios.patch(
          `/api/clients/${client._id}`,
          payload,
          config,
        );
        onSave(data.client);
      } else {
        const { data } = await axios.post("/api/clients", payload, config);
        onSave(data.client);
      }

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      });

      onClose();
      setError("");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        "Something Went wrong. Please try again";
      setError(message);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
        <h2>{client ? "Update Client" : "Add New Client"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <label>FirstName</label>
            <input
              type="text"
              value={formData.firstname}
              name="firstname"
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.formContainer}>
            <label>LastName</label>
            <input
              type="text"
              value={formData.lastname}
              name="lastname"
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.formContainer}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.formContainer}>
            <label>Phone</label>
            <input
              type="number"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.btnGroup}>
            <button type="submit">{client ? "Update" : "Add"}</button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
