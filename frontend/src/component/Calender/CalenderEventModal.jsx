import React, { useEffect, useState } from "react";
import styles from "./CalenderEventModal.module.css";
import moment from "moment";
import customFetch from "../../utils/axios";
import ClientSearch from "./ClientSearch";
import ClientModal from "../Clients/ClientModal";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError("");
    if (event) {
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

  if (moment(formData.start).isSameOrAfter(moment(formData.end))) {
    setError("End time must be after the start time.");
    return;
  }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }

      const payload = {
        ...formData,
        start: moment(formData.start).toISOString(),
        end: moment(formData.end).toISOString(),
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (event) {
        const { data } = await customFetch.patch(
          `/api/appointments/${event._id}`,
          payload,
          config,
        );
        onSave(data.appointment);
      } else {
        const { data } = await customFetch.post(
          "/api/appointments",
          payload,
          config,
        );
        onSave(data.appointment);
      }

      setFormData({ clientId: "", clientName: "", start: "", end: "" });
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

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const handleNewClientSaved = (newClient) => {
    console.log("new", newClient);
    const fullName = `${newClient.firstname} ${newClient.lastname}`;
    setFormData({ ...formData, clientName: fullName, clientId: newClient._id });

    setIsClientModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.headerDiv}>
          <h2>{event ? "Edit An Appointment" : "Add An Appointment"}</h2>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            x
          </button>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            {/* <p>Type a name and select from the list, or create a new profile.</p> */}
            <label>Client</label>
            {event ? (
              <div className={styles.clientInfo}>
                <p>{event.clientName}</p>
                <div
                  className={styles.userBtn}
                  onClick={() => navigate(`/clients/${event.clientId}`)}
                >
                  <FaRegUser />
                </div>
              </div>
            ) : (
              <>
                <ClientSearch formData={formData} setFormData={setFormData} />
                <p
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                  className={styles.addClientBtn}
                >
                  Add new Client
                </p>
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
