import *  as React from 'react';
import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import { createEventId } from './event-utils'
import axios from 'axios';
import { UserContext } from '../../context/context';


/**
 * Kyle
 * Component of Schedule
 * Modified Date:4/24/2024
 */

function Scheduler() {
  const { user, loading } = useContext(UserContext)
  const [eventlist, setEventlist] = useState([])

  useEffect(() => {
    async function startFetching() {
      try {
        if (!loading) {
          const response = await axios.get(`/users/allevents/${user.id}`);
          setEventlist(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching event from server", error);
      }
    }
    startFetching();
  }, [loading]);

  /**retrive all the events */
  async function fetchEvents() {
    try {
      if (!loading) {
        const response = await axios.get(`/users/allevents/${user.id}`);
        setEventlist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching event from server", error);
    }
  }

  /**Add Event on selected area */
  async function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')

    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection
    if (title) {
      if (!loading) {
        const data = {
          userid: user.id,
          title: title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allday
        }
        const response = await axios.post(`/users/addevents`, data);
      }
      fetchEvents()
    }

  }

  /**Delete An event */
  async function handleEventClick(clickInfo) {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      const data = {
        id: clickInfo.event.extendedProps._id,
        user_id: clickInfo.event.extendedProps.userid
      }
      const response = await axios.delete(`/users/deleteEvent`, {
        data: data
      });
      if (response.status == 200) {
        fetchEvents()
      }
      else if (response.status == 404) {
        console.log("Error deleting Event");
      }
    }
  }

  /**Move an event */
  async function handleEventMove(moveInfo){
    if (!loading) {
      const data = {
        eventid:moveInfo.event._def.extendedProps._id,
        start: moveInfo.event.startStr,
        end: moveInfo.event.endStr,
        allDay: moveInfo.event.allDay
      }
      await axios.post(`/users/moveEvent`, data);
      fetchEvents()
    }
  }

  return (
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={eventlist}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventColor = "#5932EA"
        eventDrop={handleEventMove}
        eventResize = {handleEventMove}
      />
  );
}
export default Scheduler;

