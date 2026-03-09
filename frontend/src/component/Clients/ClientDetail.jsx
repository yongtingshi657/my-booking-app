/* eslint-disable react-hooks/set-state-in-effect */
import customFetch from '../../utils/axios';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ClientDetail.module.css";
import moment from "moment";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

export default function ClientDetail() {
  const { id } = useParams();
  console.log(id);
  const [clientInfo, setClientInfo] = useState("");
  const [apptHistory, setApptHistory] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // fetch clients data
  useEffect(() => {
    setError("");

    if (!token) {
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const fetchClientInfo = async () => {
      try {
        setIsLoading(true);
        const [clientRes, apptHistRes] = await Promise.all([
          customFetch.get(`/api/clients/${id}`, config),
          customFetch.get(`/api/appointments/history/${id}`, config),
        ]);
        console.log("data", clientRes, apptHistRes);
        setClientInfo(clientRes.data.client);
        setApptHistory(apptHistRes.data.clientApptHistory);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to Fetch Client Infomation";
        setError(message);
      }

      setIsLoading(false);
    };

    if (id) {
      fetchClientInfo();
    } else {
      setError("No Id provided. Please try again");
    }
  }, [token, id]);
  const now = moment();
  const pastApptsList = apptHistory.filter((appt) =>
    moment(appt.start).isBefore(now),
  );
  const futureApptslist = apptHistory.filter((appt) =>
    moment(appt.start).isAfter(now),
  );

  const pastAppts = pastApptsList.map((appt) => (
    <li key={appt._id} className={styles.apptTime}>
      <div>
        <div className={styles.time}>{moment(appt.start).format("dddd")}</div>
        <div className={styles.time}>{moment(appt.start).format("h:mm A")}</div>
        <div className={styles.time}>
          {moment(appt.start).format("MMMM Do YYYY")}
        </div>
      </div>
      <div className={styles.statusBadge}>{appt.status}</div>
    </li>
  ));

  const futureAppts = futureApptslist.map((appt) => (
    <li key={appt._id} className={styles.apptTime}>
      <div>
        <div className={styles.time}>{moment(appt.start).format("dddd")}</div>
        <div className={styles.time}>{moment(appt.start).format("h:mm A")}</div>
        <div className={styles.time}>
          {moment(appt.start).format("MMMM Do YYYY")}
        </div>
      </div>
      <div className={styles.statusBadge}>{appt.status}</div>
    </li>
  ));

  if (isLoading) return <div>Loading Client records..</div>;
  if (!clientInfo) return <div>Client not found.</div>;

  return (
    <div className={styles.container}>
      <div onClick={() => navigate(-1)} className={styles.backBtn}>
        <FaArrowLeft /> Back
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.clientInfoDiv}>
        <h2>
          {clientInfo.firstname} {clientInfo.lastname}
        </h2>
        <div className={styles.contactDetails}>
          <span>
            <FaPhoneAlt /> {clientInfo.phone}
          </span>
          |
          <span>
            <MdEmail /> {clientInfo.email}
          </span>
        </div>
      </div>

      {futureAppts.length > 0 && (
        <div className={styles.apptSection}>
          <h3>Upcoming Appointments</h3>
          <ul>{futureAppts}</ul>
        </div>
      )}

      <div className={styles.apptSection}>
        <h3>Appointments History</h3>
        {pastAppts.length > 0 ? (
          <ul>{pastAppts}</ul>
        ) : (
          <p>No Appointments Found</p>
        )}
      </div>
    </div>
  );
}
