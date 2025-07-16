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

  console.log(
    "Total tasks:",
    tasks.length,
    "Tasks with dates:",
    validTasks.length
  );

  const taskIds = validTasks.map((t) => t.id);
  const duplicateIds = taskIds.filter(
    (id, index) => taskIds.indexOf(id) !== index
  );
  if (duplicateIds.length > 0) {
    console.warn("Duplicate task IDs found:", duplicateIds);
  }

  const events = validTasks.map((task) => {
    const startDate = task.dueDate!;
    let startDateTime = startDate;
    let endDateTime = startDate;

    console.log("Converting task to event:", {
      id: task.id,
      title: task.title,
      originalDueDate: task.dueDate,
      type: task.type,
      startTime: task.startTime,
      dueTime: task.dueTime,
    });

    const date = new Date(startDate + "T12:00:00");
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    if (task.type === "deadline") {
      // For deadline tasks, always show as all-day events
      // Use consistent ISO date format
      startDateTime = isoDate;
      endDateTime = isoDate;
    } else {
      // For other tasks, use startTime and dueTime
      if (task.startTime && task.dueTime) {
        startDateTime = `${isoDate} ${task.startTime}`;
        endDateTime = `${isoDate} ${task.dueTime}`;
      } else if (task.startTime) {
        // If only startTime is set, default to 2-hour duration
        startDateTime = `${isoDate} ${task.startTime}`;
        const endTime = new Date(`${isoDate}T${task.startTime}`);
        endTime.setHours(endTime.getHours() + 2);
        endDateTime = `${isoDate} ${endTime.toTimeString().slice(0, 5)}`;
      } else if (task.dueTime) {
        // If only dueTime is set, show as 1-hour block ending at dueTime
        const startTime = new Date(`${isoDate}T${task.dueTime}`);
        startTime.setHours(startTime.getHours() - 1);
        startDateTime = `${isoDate} ${startTime.toTimeString().slice(0, 5)}`;
        endDateTime = `${isoDate} ${task.dueTime}`;
      } else {
        // Default to all-day if no times specified
        startDateTime = isoDate;
        endDateTime = isoDate;
      }
    }

    const event = {
      id: task.id,
      title: task.title,
      start: startDateTime,
      end: endDateTime,
      description: task.description,
      color: getPriorityColor(task.priority),
    };

    console.log("Generated event:", event);
    return event;
  });

  // Check for duplicate event IDs
  const eventIds = events.map((e) => e.id);
  const duplicateEventIds = eventIds.filter(
    (id, index) => eventIds.indexOf(id) !== index
  );
  if (duplicateEventIds.length > 0) {
    console.warn("Duplicate event IDs found:", duplicateEventIds);
  }

  console.log("Final events array:", events);
  return events;
}
