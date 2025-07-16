"use client";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createResizePlugin } from "@schedule-x/resize";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/context/TasksContext";
import { useModal } from "@/context/ModalContext";
import Task from "@/types/task";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { convertTasksToEvents, padMonth } from "@/utils/calendar";

import "@schedule-x/theme-default/dist/index.css";

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const { tasks, isLoading, updateExistingTask } = useTasks();
  const { openEditModal } = useModal();
  const [isReady, setReady] = useState(false);

  // Following the official React documentation pattern
  const [eventsService] = useState(() => createEventsServicePlugin());

  const handleEventUpdate = useCallback(
    async (updatedEvent: any) => {
      try {
        let newDueDate: string;
        let newStart: Date;
        let newEnd: Date;

        if (typeof updatedEvent.start === "string") {
          if (updatedEvent.start.includes(" ")) {
            const [datePart, timePart] = updatedEvent.start.split(" ");
            newDueDate = datePart;
            newStart = new Date(`${datePart}T${timePart}:00`);
          } else {
            newDueDate = updatedEvent.start;
            newStart = new Date(`${updatedEvent.start}T00:00:00`);
          }
        } else {
          newStart = new Date(updatedEvent.start);
          newDueDate =
            newStart.getFullYear() +
            "-" +
            padMonth(newStart.getMonth() + 1) +
            "-" +
            String(newStart.getDate()).padStart(2, "0");
        }

        if (typeof updatedEvent.end === "string") {
          if (updatedEvent.end.includes(" ")) {
            const [datePart, timePart] = updatedEvent.end.split(" ");
            newEnd = new Date(`${datePart}T${timePart}:00`);
          } else {
            newEnd = new Date(`${updatedEvent.end}T00:00:00`);
          }
        } else {
          newEnd = new Date(updatedEvent.end);
        }

        const taskToUpdate = tasks.find((task) => task.id === updatedEvent.id);
        if (taskToUpdate) {
          const updates: Partial<Task> = {
            dueDate: newDueDate,
          };

          if (updatedEvent.start.includes(" ")) {
            // This is a timed event
            if (taskToUpdate.type === "deadline") {
              // Deadlines should remain all-day, but if moved to a timed slot,
              // we can optionally set the dueTime
              const newDueTime =
                String(newStart.getHours()).padStart(2, "0") +
                ":" +
                String(newStart.getMinutes()).padStart(2, "0");
              updates.dueTime = newDueTime;
            } else {
              const newStartTime =
                String(newStart.getHours()).padStart(2, "0") +
                ":" +
                String(newStart.getMinutes()).padStart(2, "0");
              const newDueTime =
                String(newEnd.getHours()).padStart(2, "0") +
                ":" +
                String(newEnd.getMinutes()).padStart(2, "0");
              updates.startTime = newStartTime;
              updates.dueTime = newDueTime;
            }
          } else {
            // This is an all-day event
            if (taskToUpdate.type === "deadline") {
              // For deadlines moved as all-day events, clear the dueTime
              updates.dueTime = "";
            }
          }

          await updateExistingTask(taskToUpdate.id, updates);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    [tasks, updateExistingTask]
  );

  const handleEventClick = useCallback(
    (clickedEvent: any) => {
      openEditModal(clickedEvent.id);
    },
    [openEditModal]
  );

  const [dragAndDropPlugin] = useState(() => createDragAndDropPlugin());
  const [resizePlugin] = useState(() => createResizePlugin());
  const [currentTimePlugin] = useState(() =>
    createCurrentTimePlugin({
      fullWeekWidth: true,
    })
  );

  // Initialize calendar with empty events array - we'll populate via events service
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [], // Always start with empty array
    plugins: [
      eventsService,
      dragAndDropPlugin,
      resizePlugin,
      currentTimePlugin,
    ],
    isDark: true,
    callbacks: {
      onEventUpdate: handleEventUpdate,
      onEventClick: handleEventClick,
    },
    theme: "dark",
  });

  useEffect(() => {
    if (user) {
      setReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (isReady && tasks.length >= 0) {
      const events = convertTasksToEvents(tasks);

      console.log("Calendar: Syncing events", {
        taskCount: tasks.length,
        eventCount: events.length,
        taskIds: tasks.map((t) => t.id).slice(0, 5),
      });

      eventsService.set(events);
    }
  }, [tasks, eventsService, isReady]);
  useEffect(() => {
    return () => {
      eventsService.set([]);
    };
  }, [eventsService]);

  if (loading || isLoading || !isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-4 px-4 pt-4 animate-in fade-in duration-300">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Showing {tasks.filter((t) => t.dueDate).length} scheduled tasks.
        </p>
      </div>

      <div className="calendar-container flex-1 bg-background">
        <div
          className="sx-react-calendar-wrapper"
          style={{ backgroundColor: "transparent" }}
        >
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </div>
  );
}
