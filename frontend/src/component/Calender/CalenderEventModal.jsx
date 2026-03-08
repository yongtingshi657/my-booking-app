import React, { useEffect, useState } from "react";
import styles from "./CalenderEventModal.module.css";
import moment from "moment";
import axios from "axios";
import ClientSearch from "./ClientSearch";
import ClientModal from "../Clients/ClientModal";

export default function CalenderEventModal({
  isOpen,
  onClose,
  onSave,
  date,
  event,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    start: "",
    end: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        clientName: event.client,
        start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
        // transfer calnderdate to form input data
        end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
        clientId: event.clientId,
      });
    }
    if (date) {
      const defaultStart = moment(date);
      const defaultEnd = moment(date).add(1, "hour");
      setFormData({
        clientName: "",
        // clientId:event.clientId
        start: defaultStart.format("YYYY-MM-DDTHH:mm"),
        end: defaultEnd.format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [event, date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (!formData.clientId) {
      setError("Please select a client or add a new one before saving.");
      return;
    }

    if (new Date(formData.start) >= new Date(formData.end)) {
      setError("End time must be after the start time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }

      const payload = formData;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (event) {
        const { data } = await axios.patch(
          `/api/appointments/${event._id}`,
          payload,
          config,
        );
        onSave(data.appointment);
      } else {
        const { data } = await axios.post("/api/appointments", payload, config);
        onSave(data.appointment);
      }

      setFormData({ clientId: "", clientName: "", start: "", end: "" });
      onClose();
      setError("");
    } catch (error) {
      console.log(error);
      setError("Something Went wrong. Please try again");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const handleNewClientSaved = (newClient) => {
    console.log("new", newClient)
    const fullName = `${newClient.firstname} ${newClient.lastname}`;
    setFormData({ ...formData, clientName: fullName, clientId: newClient._id });
    
    setIsClientModalOpen(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
        <h2>{event ? "Edit An Appoinment" : "Add An Appoinment"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <label>Client</label>
            {event ? (
              <p>{event.clientName}</p>
            ) : (
              <>
                <ClientSearch formData={formData} setFormData={setFormData} />
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                >
                  Add new Client
                </button>
              </>
            )}

          </div>
          <div className={styles.formContainer}>
            <label>Start</label>
            <input
              type="datetime-local"
              value={formData.start}
              name="start"
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className={styles.formContainer}>
            <label>End</label>
            <input
              type="datetime-local"
              value={formData.end}
              name="end"
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className={styles.btnGroup}>
            <button
              type="submit"
              disabled={!formData.clientId}
              className={
                !formData.clientId ? styles.disabledBtn : styles.submitBtn
              }
            >
              {event ? "Update" : "Add"}
            </button>
            {event && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => onDelete(event._id)}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>

        
          {isClientModalOpen && (
              <ClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSave={handleNewClientSaved}
                client={null}
              />
            )}
      </div>
    </div>
  );
}
