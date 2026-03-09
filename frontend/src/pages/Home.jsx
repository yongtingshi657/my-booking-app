import moment from "moment";
import { useEffect, useState } from "react";
import customFetch from '../utils/axios';
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const [todayAppts, setTodayAppts] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // moment() return objects
  // format return string

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchAppointments = async () => {
      // convert to date string to send to db
      const start = moment().startOf("day").toISOString();
      const end = moment().endOf("day").toISOString();
      try {
        const { data } = await customFetch.get("/api/appointments", {
          params: { startDate: start, endDate: end },
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedAppts = [...data.appointments].sort(
          (a, b) => moment(a.start) - moment(b.start),
        );
        console.log(sortedAppts.clientId);
        // recieve date string from db
        setTodayAppts(sortedAppts);
      } catch (error) {
        console.log(error);
        const message =
        error.response?.data?.message ||
        "Failed to fetch Appointments. Please try again";
      setError(message);
      }
    };

    fetchAppointments();
  }, [token]);

  const appts = todayAppts.map((appt) => (
    <li
      key={appt._id}
      className={styles.apptLine}
      onClick={() => navigate(`/clients/${appt.clientId}`)}
    >
      <div style={{ display: "flex" }}>
        <div className={styles.time}>{moment(appt.start).format("h:mm A")}</div>
        <div className={styles.clientName}>{appt.clientName}</div>
      </div>
      <div>
        <FaArrowRight />
      </div>
    </li>
  ));

  return (
    <div className={styles.mainContainer}>
      <div className={styles.homeContainer}>
        {error && <p className={styles.errorText}>{error}</p>}
        <h2 className={styles.dateHeader}>
          {moment().format("dddd, MMMM Do YYYY")}
        </h2>
        <p className={styles.header}>Today's Appointments</p>
        <ul className={styles.apptsList}>
          {todayAppts.length > 0 ? (
            appts
          ) : (
            <p className={styles.noAppt}>No appoinments for today</p>
          )}
        </ul>
      </div>
      <div className={styles.links}>
        <p
          onClick={() => navigate("/bookings")}
          className={styles.primarylinks}
        >
          <FaArrowRight />
          Go to Calendar
        </p>
        <p onClick={() => navigate("/clients")} className={styles.primarylinks}>
          <FaArrowRight /> View Client List
        </p>
      </div>
    </div>
  );
}
