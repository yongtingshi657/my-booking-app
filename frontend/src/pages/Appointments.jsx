/* eslint-disable react-hooks/static-components */
import moment from "moment";
import { useEffect, useState } from "react";
import CalenderEventModal from "../component/Calender/CalenderEventModal";
import CalenderView from "../component/Calender/CalenderView";
import axios from "axios";

function Appointments() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [isOpenEvent, setIsOpenEvent] = useState(false);

  const token = localStorage.getItem("token");

  //   fetch appts
  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchAppointments = async () => {
      const start = moment().startOf("month").toISOString();
      const end = moment().endOf("month").toISOString();
      try {
        const { data } = await axios.get("/api/appointments", {
          params: { startDate: start, endDate: end },
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatedAppts = data.appointments.map((appt) => ({
          ...appt,
          start: new Date(appt.start),
          end: new Date(appt.end),
          client: appt.clientName,
        }));
        console.log("data", formatedAppts);

        setEvents(formatedAppts);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch Appointments");
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
        return events.map((event) =>
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
    try {
      if (!token) {
        setError("No authentication token found. Please Log in");
        return;
      }
      await axios.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (window.confirm("Are you sure you want to delete this appointment?")) {
        setEvents((prev) => prev.filter((ev) => ev._id !== id));
      }
    } catch (error) {
      console.log(error);
      setError("Failed to Delete Appointment");
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

      const { data } = await axios.patch(
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
      setError("something went wrong");
    }
  };

  return (
    <>
      {error && <p>{error}</p>}
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
