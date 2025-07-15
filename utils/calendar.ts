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
  return tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const startDate = task.dueDate!;
      let startDateTime = startDate;
      let endDateTime = startDate;

      if (task.type === "deadline") {
        // For deadline tasks, always show as all-day events
        startDateTime = startDate;
        endDateTime = startDate;
      } else {
        // For other tasks, use startTime and dueTime
        if (task.startTime && task.dueTime) {
          startDateTime = `${startDate} ${task.startTime}`;
          endDateTime = `${startDate} ${task.dueTime}`;
        } else if (task.startTime) {
          // If only startTime is set, default to 2-hour duration
          startDateTime = `${startDate} ${task.startTime}`;
          const endTime = new Date(`${startDate}T${task.startTime}`);
          endTime.setHours(endTime.getHours() + 2);
          endDateTime = `${startDate} ${endTime.toTimeString().slice(0, 5)}`;
        } else if (task.dueTime) {
          // If only dueTime is set, show as 1-hour block ending at dueTime
          const startTime = new Date(`${startDate}T${task.dueTime}`);
          startTime.setHours(startTime.getHours() - 1);
          startDateTime = `${startDate} ${startTime
            .toTimeString()
            .slice(0, 5)}`;
          endDateTime = `${startDate} ${task.dueTime}`;
        }
      }

      return {
        id: task.id,
        title: task.title,
        start: startDateTime,
        end: endDateTime,
        description: task.description,
        color: getPriorityColor(task.priority),
      };
    });
}
