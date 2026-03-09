import styles from "./CalenderView.module.css";
/* eslint-disable react-hooks/static-components */

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);

export default function CalenderView({
  events,
  handleSelectSlot,
  handleSelectEvent,
  handleEventDrop
}) {
  const DnDCalendar = withDragAndDrop(Calendar);

  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: "#f0efdc", // Matching your text color for a cohesive look
      borderRadius: "8px",
      opacity: 0.9,
      color: "black",
      border: "1px solid lightgrey",
      display: "block",
      padding: "2px 5px",
      fontSize: "1rem",
      fontWeight: "500",
      boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
    };

    return {
      style: style,
    };
  };

  const scrollToTime = new Date();
  scrollToTime.setHours(8, 0, 0);

  // const minTime = new Date();
  // minTime.setHours(8, 0, 0); // Calendar starts at 8 AM

  // const maxTime = new Date();
  // maxTime.setHours(20, 0, 0); // Calendar ends at 8 PM

  return (
    <>
      <div className={styles.calenderContainer}>
        <DnDCalendar
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh" }}
          eventPropGetter={eventPropGetter}
          // min={minTime}
          // max={maxTime}
          scrollToTime={scrollToTime}
          titleAccessor="clientName"
          idAccessor="_id"
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          defaultView="week"
        />
      </div>
    </>
  );
}
