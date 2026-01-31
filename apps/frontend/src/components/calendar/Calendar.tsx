"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [, setEventEndDate] = useState("");
  const [, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [taskRows, setTaskRows] = useState([
    { id: 1, projectName: "", taskName: "", hours: 0 }
  ]);
  const [selectedTaskEvent, setSelectedTaskEvent] = useState<CalendarEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();


  useEffect(() => {
    // Initialize with some events
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    
    // Set the selected task event for editing
    const eventData = event as unknown as CalendarEvent;
    setSelectedTaskEvent(eventData);
    
    // Parse the event title to populate task rows for editing
    // Format: "ProjectName: TaskName (Xh)"
    const titleMatch = event.title.match(/^(.+?):\s*(.+?)\s*\((\d+\.?\d*)h\)$/);
    if (titleMatch) {
      setTaskRows([{
        id: 1,
        projectName: titleMatch[1],
        taskName: titleMatch[2],
        hours: parseFloat(titleMatch[3])
      }]);
    }
    
    openModal();
  };


  const handleSubmitTasks = () => {
    console.log("Submitted tasks:", taskRows);
    
    if (selectedTaskEvent) {
      // Update the existing clicked task
      const updatedEvents = events.map(event => {
        if (event.id === selectedTaskEvent.id) {
          return {
            ...event,
            title: `${taskRows[0].projectName}: ${taskRows[0].taskName} (${taskRows[0].hours}h)`,
            start: eventStartDate || event.start,
          };
        }
        return event;
      });
      
      // If there are additional task rows, add them as new events
      if (taskRows.length > 1) {
        const additionalEvents: CalendarEvent[] = taskRows.slice(1).map((task, index) => ({
          id: `task-${Date.now()}-${index}`,
          title: `${task.projectName}: ${task.taskName} (${task.hours}h)`,
          start: eventStartDate || new Date().toISOString().split("T")[0],
          extendedProps: { calendar: "Primary" },
        }));
        setEvents([...updatedEvents, ...additionalEvents]);
      } else {
        setEvents(updatedEvents);
      }
    } else {
      // Create new calendar events from task rows
      const newEvents: CalendarEvent[] = taskRows.map((task, index) => ({
        id: `task-${Date.now()}-${index}`,
        title: `${task.projectName}: ${task.taskName} (${task.hours}h)`,
        start: eventStartDate || new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Primary" },
      }));
      
      // Add new events to the calendar
      setEvents([...events, ...newEvents]);
    }
    
    closeModal();
    resetModalFields();
  };

  const handleAddNewTask = () => {
    setTaskRows([
      ...taskRows,
      { id: taskRows.length + 1, projectName: "", taskName: "", hours: 0 }
    ]);
  };

  const handleRemoveTask = (id: number) => {
    if (taskRows.length > 1) {
      setTaskRows(taskRows.filter(task => task.id !== id));
    }
  };

  const handleTaskChange = (id: number, field: string, value: string | number) => {
    setTaskRows(taskRows.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
    setSelectedTaskEvent(null);
    setTaskRows([{ id: 1, projectName: "", taskName: "", hours: 0 }]);
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Work Log +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] p-6 lg:p-10"
      >
        <div className="flex flex-col overflow-y-auto custom-scrollbar max-h-[80vh]">
          <div className="mb-6">
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedTaskEvent ? 'Edit Work Log' : 'Add Work Log'} for {eventStartDate || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </h5>
          </div>

          <div className="space-y-6">
            {taskRows.map((task, index) => (
              <div key={task.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h6 className="font-medium text-gray-800 dark:text-white/90">
                    Task Row {index + 1}
                  </h6>
                  {taskRows.length > 1 && (
                    <button
                      onClick={() => handleRemoveTask(task.id)}
                      type="button"
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Project Name */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={task.projectName}
                      onChange={(e) => handleTaskChange(task.id, 'projectName', e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      placeholder="Enter project name"
                    />
                  </div>

                  {/* Task Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Task Name
                    </label>
                    <input
                      type="text"
                      value={task.taskName}
                      onChange={(e) => handleTaskChange(task.id, 'taskName', e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      placeholder="Enter task name"
                    />
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Hours
                    </label>
                    <input
                      type="number"
                      value={task.hours}
                      onChange={(e) => handleTaskChange(task.id, 'hours', parseFloat(e.target.value) || 0)}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      placeholder="0"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Task Button */}
            <button
              onClick={handleAddNewTask}
              type="button"
              className="flex items-center gap-2 w-full justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:border-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmitTasks}
              type="button"
              className="flex-1 justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
            >
              {selectedTaskEvent ? 'Update Task' : 'Submit Tasks'}
            </button>
            <button
              onClick={closeModal}
              type="button"
              className="flex-1 justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800/50"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
