/* eslint-disable react-hooks/static-components */
import moment from "moment";
import { useEffect, useState } from "react";
import CalenderEventModal from "../component/Calender/CalenderEventModal";
import CalenderView from "../component/Calender/CalenderView";
import customFetch from '../utils/axios';

function Appointments() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [isOpenEvent, setIsOpenEvent] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError('')


    if (!token) {
      return;
    }
    const fetchAppointments = async () => {
      const start = moment().startOf("month").toISOString();
      const end = moment().endOf("month").toISOString();
      try {
        const { data } = await customFetch.get("/api/appointments", {
          params: { startDate: start, endDate: end },
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatedAppts = data.appointments.map((appt) => ({
          ...appt,
          start: moment(appt.start).local().toDate(),
          end: moment(appt.end).local().toDate(),
          client: appt.clientName,
        }));
        console.log("data", formatedAppts);

        setEvents(formatedAppts);
      } catch (error) {
        console.log(error);
         const message =
            error.response?.data?.message || "Failed to fetch Appointments";
          setError(message);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleSelectEvent = (event) => {
    console.log("event", event);
    setSelectedDate(null);
    setSelectedEvent(event);
    setIsOpenEvent(true);
  };
  const handleSelectSlot = (slotInfo) => {
    console.log("slot", slotInfo);
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpenEvent(true);
  };

  // save Event
  const handleSaveEvent = (eventData) => {
    console.log("e", eventData);
    const formattedEvent = {
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
      client: eventData.clientName,
    };

    setEvents((prev) => {
      const isExisting = prev.find((ev) => ev._id === eventData._id);

      if (isExisting) {
        return prev.map((event) =>
          event._id === eventData._id ? formattedEvent : event,
        );
      } else {
        return [...events, formattedEvent];
      }
    });

    setSelectedDate(null);
    setSelectedEvent(null);
    setIsOpenEvent(false);
  };

  //   delete event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }
      await customFetch.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((ev) => ev._id !== id));
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        "Failed to Delete Appointment. Please try again";
      setError(message);
    }

    setIsOpenEvent(false);
    setSelectedEvent(null);
  };

  const handleEventDrop = async ({ start, event, end }) => {
    if (!event._id) {
      setError("Cannot move appointment: ID missing. Please refresh.");
      return;
    }
    const updatedEvent = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    try {
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }

      const { data } = await customFetch.patch(
        `/api/appointments/${event._id}`,
        updatedEvent,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const upEvent = { ...event, start, end };
      setEvents((prev) =>
        prev.map((ev) => (ev._id === event._id ? upEvent : ev)),
      );

      setError("");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        "Something Went Wrong. Please try again";
      setError(message);
    }
  };

  return (
    <>
      {error && <p className="errorText">{error}</p>}
      <CalenderView
        events={events}
        handleSelectEvent={handleSelectEvent}
        handleSelectSlot={handleSelectSlot}
        handleEventDrop={handleEventDrop}
      />
      {isOpenEvent && (
        <CalenderEventModal
          isOpen={isOpenEvent}
          onClose={() => {
            setIsOpenEvent(false);
          }}
          date={selectedDate}
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  );
}

export default Appointments;
