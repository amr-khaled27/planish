export default interface Task {
  type: string;
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  dueTime?: string;
  startTime?: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
}
