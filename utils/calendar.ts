import Task from "@/types/task";

const DEFAULT_EVENT_DURATION_HOURS = 1;
const DEFAULT_TASK_DURATION_HOURS = 2;

export function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}

export function formatTimeToAMPM(time24: string): string {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  calendarId?: string;
  rrule?: string;
}

function doesEventSpanMidnight(startTime: string, endTime: string): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes <= startMinutes;
}

function getNextDayDateString(dateString: string): string {
  const nextDay = new Date(dateString);
  nextDay.setDate(nextDay.getDate() + 1);
  return `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
}

function addHoursToTime(dateString: string, timeString: string, hours: number): string {
  const dateTime = new Date(`${dateString}T${timeString}`);
  dateTime.setHours(dateTime.getHours() + hours);
  return dateTime.toTimeString().slice(0, 5);
}

function subtractHoursFromTime(dateString: string, timeString: string, hours: number): string {
  const dateTime = new Date(`${dateString}T${timeString}`);
  dateTime.setHours(dateTime.getHours() - hours);
  return dateTime.toTimeString().slice(0, 5);
}

function isValidDate(year: number, month: number, day: number): boolean {
  const testDate = new Date(year, month - 1, day);
  return (
    testDate.getFullYear() === year &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
}

function getDefaultDateForHabit(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function calculateEventTiming(task: Task, safeIsoDate: string): { start: string; end: string } {
  const isHabit = task.type === "habit";
  const defaultDuration = isHabit ? DEFAULT_EVENT_DURATION_HOURS : DEFAULT_TASK_DURATION_HOURS;

  if (task.type === "deadline") {
    return { start: safeIsoDate, end: safeIsoDate };
  }

  if (task.startTime && task.dueTime) {
    const startDateTime = `${safeIsoDate} ${task.startTime}`;
    
    if (doesEventSpanMidnight(task.startTime, task.dueTime)) {
      const nextDayStr = getNextDayDateString(safeIsoDate);
      return { 
        start: startDateTime, 
        end: `${nextDayStr} ${task.dueTime}` 
      };
    } else {
      return { 
        start: startDateTime, 
        end: `${safeIsoDate} ${task.dueTime}` 
      };
    }
  }

  if (task.startTime) {
    const startDateTime = `${safeIsoDate} ${task.startTime}`;
    const endTime = addHoursToTime(safeIsoDate, task.startTime, defaultDuration);
    return { 
      start: startDateTime, 
      end: `${safeIsoDate} ${endTime}` 
    };
  }

  if (task.dueTime) {
    const startTime = subtractHoursFromTime(safeIsoDate, task.dueTime, 1);
    return { 
      start: `${safeIsoDate} ${startTime}`, 
      end: `${safeIsoDate} ${task.dueTime}` 
    };
  }

  return { start: safeIsoDate, end: safeIsoDate };
}

export function convertTasksToEvents(tasks: Task[]): CalendarEvent[] {
  const validTasks = tasks.filter((task) => task.dueDate || task.type === "habit");

  console.log("Converting tasks to events:", {
    totalTasks: tasks.length,
    validTasks: validTasks.length,
    habitTasks: tasks.filter(t => t.type === "habit").length,
  });

  const uniqueTasks = validTasks.filter(
    (task, index, self) => index === self.findIndex((t) => t.id === task.id)
  );

  if (uniqueTasks.length !== validTasks.length) {
    console.warn("Removed duplicate tasks:", validTasks.length - uniqueTasks.length);
  }

  const events = uniqueTasks
    .map((task): CalendarEvent | null => {
      try {
        let originalDate: string;
        if (task.type === "habit" && !task.dueDate) {
          originalDate = getDefaultDateForHabit();
        } else {
          originalDate = task.dueDate!;
        }

        const [year, month, day] = originalDate.split("-").map(Number);
        if (!isValidDate(year, month, day)) {
          console.error(`Invalid date detected: ${originalDate} for task ${task.id}`);
          return null;
        }

        const safeIsoDate = `${String(year)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        console.log("Processing task:", {
          id: task.id,
          title: task.title,
          originalDate,
          safeDate: safeIsoDate,
          type: task.type,
        });

        const { start, end } = calculateEventTiming(task, safeIsoDate);

        const event: CalendarEvent = {
          id: task.id,
          title: task.title,
          start,
          end,
          description: task.description || "",
          calendarId: task.priority,
        };

        if (task.type === "habit") {
          event.rrule = "FREQ=DAILY";
        }

        console.log("Generated event:", event);
        return event;
      } catch (error) {
        console.error(`Error processing task ${task.id}:`, error);
        return null;
      }
    })
    .filter((event): event is CalendarEvent => event !== null);

  const uniqueEvents = events.filter(
    (event, index, self) => index === self.findIndex((e) => e.id === event.id)
  );

  if (uniqueEvents.length !== events.length) {
    console.warn("Removed duplicate events:", events.length - uniqueEvents.length);
  }

  console.log("Final unique events:", uniqueEvents);
  return uniqueEvents;
}
