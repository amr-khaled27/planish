import Task from "@/types/task";

export function padMonth(month: number): string {
  return String(month).padStart(2, "0");
}

export function formatTimeToAMPM(time24: string): string {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  color: string;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "#ef4444"; // red
    case "high":
      return "#f97316"; // orange
    case "medium":
      return "#eab308"; // yellow
    case "low":
      return "#22c55e"; // green
    default:
      return "#6b7280"; // gray
  }
}

export function convertTasksToEvents(tasks: Task[]): CalendarEvent[] {
  const validTasks = tasks.filter((task) => task.dueDate);

  console.log("Converting tasks to events:", {
    totalTasks: tasks.length,
    validTasks: validTasks.length,
  });

  const uniqueTasks = validTasks.filter(
    (task, index, self) => index === self.findIndex((t) => t.id === task.id)
  );

  if (uniqueTasks.length !== validTasks.length) {
    console.warn(
      "Removed duplicate tasks:",
      validTasks.length - uniqueTasks.length
    );
  }

  const events = uniqueTasks
    .map((task): CalendarEvent | null => {
      const originalDate = task.dueDate!;

      const [year, month, day] = originalDate.split("-").map(Number);

      const testDate = new Date(year, month - 1, day);
      const isValidDate =
        testDate.getFullYear() === year &&
        testDate.getMonth() === month - 1 &&
        testDate.getDate() === day;

      if (!isValidDate) {
        console.error(`Invalid date detected: ${originalDate}`);
        return null;
      }

      const safeYear = String(year);
      const safeMonth = String(month).padStart(2, "0");
      const safeDay = String(day).padStart(2, "0");
      const safeIsoDate = `${safeYear}-${safeMonth}-${safeDay}`;

      let startDateTime = safeIsoDate;
      let endDateTime = safeIsoDate;

      console.log("Processing task:", {
        id: task.id,
        title: task.title,
        originalDate: originalDate,
        safeDate: safeIsoDate,
        type: task.type,
      });

      if (task.type === "deadline") {
        // All deadline tasks are all-day events
        startDateTime = safeIsoDate;
        endDateTime = safeIsoDate;
      } else {
        // Handle timed events
        if (task.startTime && task.dueTime) {
          startDateTime = `${safeIsoDate} ${task.startTime}`;
          endDateTime = `${safeIsoDate} ${task.dueTime}`;
        } else if (task.startTime) {
          startDateTime = `${safeIsoDate} ${task.startTime}`;
          const endTime = new Date(`${safeIsoDate}T${task.startTime}`);
          endTime.setHours(endTime.getHours() + 2);
          endDateTime = `${safeIsoDate} ${endTime.toTimeString().slice(0, 5)}`;
        } else if (task.dueTime) {
          const startTime = new Date(`${safeIsoDate}T${task.dueTime}`);
          startTime.setHours(startTime.getHours() - 1);
          startDateTime = `${safeIsoDate} ${startTime
            .toTimeString()
            .slice(0, 5)}`;
          endDateTime = `${safeIsoDate} ${task.dueTime}`;
        } else {
          // Default to all-day if no times specified
          startDateTime = safeIsoDate;
          endDateTime = safeIsoDate;
        }
      }

      const event: CalendarEvent = {
        id: task.id,
        title: task.title,
        start: startDateTime,
        end: endDateTime,
        description: task.description || "",
        color: getPriorityColor(task.priority),
      };

      console.log("Generated event:", event);
      return event;
    })
    .filter((event): event is CalendarEvent => event !== null); // Remove any null events from invalid dates

  // Final duplicate check on events
  const uniqueEvents = events.filter(
    (event, index, self) => index === self.findIndex((e) => e.id === event.id)
  );

  if (uniqueEvents.length !== events.length) {
    console.warn(
      "Removed duplicate events:",
      events.length - uniqueEvents.length
    );
  }

  console.log("Final unique events:", uniqueEvents);
  return uniqueEvents;
}
