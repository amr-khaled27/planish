"use client";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
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
import { createEventRecurrencePlugin, createEventsServicePlugin } from "@schedule-x/event-recurrence";
import { EventTooltip } from "@/components/calendar/EventTooltip";
import { useEventTooltip } from "@/hooks/useEventTooltip";

import "@schedule-x/theme-default/dist/index.css";

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const { tasks, isLoading, updateExistingTask } = useTasks();
  const { openEditModal } = useModal();
  const [isReady, setReady] = useState(false);

  const [eventsService] = useState(() => createEventsServicePlugin());
  const [recurrencePlugin] = useState(() => createEventRecurrencePlugin());

  const { hoverState, initializeTooltips } = useEventTooltip(tasks);

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
            if (taskToUpdate.type === "deadline") {
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
            if (taskToUpdate.type === "deadline") {
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

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [],
    calendars: {
      urgent: {
        colorName: 'urgent',
        lightColors: {
          main: '#ef4444',
          container: '#fee2e2',
          onContainer: '#7f1d1d',
        },
        darkColors: {
          main: '#fca5a5',
          container: '#991b1b',
          onContainer: '#fef2f2',
        },
      },
      high: {
        colorName: 'high',
        lightColors: {
          main: '#f97316',
          container: '#fed7aa',
          onContainer: '#9a3412',
        },
        darkColors: {
          main: '#fdba74',
          container: '#c2410c',
          onContainer: '#fff7ed',
        },
      },
      medium: {
        colorName: 'medium',
        lightColors: {
          main: '#eab308',
          container: '#fef3c7',
          onContainer: '#92400e',
        },
        darkColors: {
          main: '#fde047',
          container: '#a16207',
          onContainer: '#fffbeb',
        },
      },
      low: {
        colorName: 'low',
        lightColors: {
          main: '#22c55e',
          container: '#dcfce7',
          onContainer: '#166534',
        },
        darkColors: {
          main: '#4ade80',
          container: '#15803d',
          onContainer: '#f0fdf4',
        },
      },
    },
    plugins: [
      recurrencePlugin,
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
      
      setTimeout(() => {
        initializeTooltips();
      }, 200);
    }
  }, [tasks, eventsService, isReady, initializeTooltips]);
  useEffect(() => {
    return () => {
      eventsService.set([]);
    };
  }, [eventsService]);

  useEffect(() => {
    if (isReady) {
      const timeoutId = setTimeout(() => {
        initializeTooltips();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isReady, initializeTooltips]);

  if (loading || isLoading || !isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-4 px-4 pt-4 animate-in fade-in duration-300">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Showing {tasks.filter((t) => t.dueDate || t.type === "habit").length} scheduled tasks.
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

      {hoverState.visible && hoverState.task && hoverState.event && (
        <EventTooltip
          event={hoverState.event}
          task={hoverState.task}
          position={hoverState.position}
          visible={hoverState.visible}
        />
      )}
    </div>
  );
}
