import *  as React from 'react';
import {  useContext } from 'react';
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios';
import { UserContext } from '../../context/context';


/**
 * Kyle
 * Component of Schedule
 * Modified Date:4/24/2024
 */

function ST_Scheduler() {
  const { user, loading } = useContext(UserContext)
  const [eventlist, setEventlist] = useState([])

  useEffect(() => {
    async function startFetching() {
      try {
        if (!loading) {
          const response = await axios.get(`/users/allRosters/${user.id}`);
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
        const response = await axios.get(`/users/allRosters/${user.id}`);
        setEventlist(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching event from server", error);
    }
  }

  /**Add Event on selected area */
  async function handleDateSelect(selectInfo) {
    let repeat = prompt('Create a new weekly shift? Yes or No')
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection

    if (repeat) {
      if (!loading) {
        if(repeat == ("Yes"||"y"||"yes"||"Y")){
            const data = {
                userid: user.id,
                daysOfWeek: selectInfo.start.getDay(),
                startTime: selectInfo.start.toTimeString().split(' ')[0],
                endTime: selectInfo.end.toTimeString().split(' ')[0],
                allDay: selectInfo.allday
              }
              await axios.post(`/users/addRoster`, data);

      }
      fetchEvents()
    }

  }
  }
  /**Delete An event */
  async function handleEventClick(clickInfo) {
    if (window.confirm(`Are you sure you want to delete the this shift?`)) {
      const data = {
        id: clickInfo.event.extendedProps._id,
        user_id: clickInfo.event.extendedProps.userid
      }
      const response = await axios.delete(`/users/deleteRoster`, {
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
    console.log(moveInfo)
    if (!loading) {
      const data = {
        eventid:moveInfo.event._def.extendedProps._id,
        startTime: moveInfo.event.start.toTimeString().split(' ')[0],
        endTime: moveInfo.event.end.toTimeString().split(' ')[0],
        allDay: moveInfo.event.allDay,
        daysOfWeek: moveInfo.event.start.getDay()
      }
      await axios.post(`/users/moveRoster`, data);
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
        eventColor = "#0A5C36"
        eventDrop={handleEventMove}
        eventResize={handleEventMove}
      />
  );
}
export default ST_Scheduler;

