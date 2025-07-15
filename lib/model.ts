"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Task from "@/types/task";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function initializeModel() {
  const instructions = `You are a productivity AI that helps users break down complex tasks into manageable subtasks with smart timing suggestions. 

Guidelines:
- Always respond with a valid JSON array of objects
- Each object should have: title, dueDate, dueTime, startTime
- Keep titles concise but descriptive (under 50 characters)
- Generate 3-6 subtasks that logically build toward the main goal
- Consider task dependencies and logical sequence
- Suggest realistic timing between 8am (08:00) and 10pm (22:00)
- Use 24-hour time format (HH:MM) and YYYY-MM-DD date format
- Space tasks appropriately to allow completion time
- Avoid overly granular steps that don't add value`;

  console.log(instructions);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: instructions,
  });

  return model;
}

export async function splitTask(task: Task, currentOtherActiveTasks: Task[]) {
  const model = await initializeModel();

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  const currentTimeString = currentDate.toTimeString().slice(0, 5); // HH:MM format

  const prompt = `You are an AI assistant that helps users split tasks into smaller, manageable subtasks with timing suggestions. 

IMPORTANT: Current server date/time: ${currentDate.toISOString()} (${currentDateString} at ${currentTimeString})

Task to split: "${task.title}"
Task description: "${task.description}"
Parent task due date: ${task.dueDate || "No due date"}
Parent task due time: ${task.dueTime || "No due time"}

Current active tasks context: ${currentOtherActiveTasks
    .map((t) => t.title)
    .join(", ")}

Please break this task into 3-6 clear, actionable subtasks with suggested timing. Respond with a JSON array of objects.

Example format:
[
  {
    "title": "Research topic",
    "dueDate": "2025-07-16",
    "dueTime": "14:00",
    "startTime": "13:00"
  },
  {
    "title": "Write outline",
    "dueDate": "2025-07-17",
    "dueTime": "16:00",
    "startTime": "15:00"
  }
]

CRITICAL REQUIREMENTS:
- NEVER generate dates before ${currentDateString}
- All suggested dates must be ${currentDateString} or later
- If suggesting today (${currentDateString}), ensure times are after ${currentTimeString}
- Each subtask should be specific and actionable
- Title should be concise (under 50 characters)
- Suggest realistic timing between 8am-10pm
- Space subtasks logically (allow time for completion)
- If parent has due date, ensure all subtasks finish before it
- Include estimated start and due times (24-hour format)
- Dates in YYYY-MM-DD format
- Times in HH:MM format
- Return only the JSON array, no additional text`;

  try {
    const response = await model.generateContent(prompt);
    const responseText = response.response.text().trim();

    const jsonMatch = responseText.match(/\[([\s\S]*?)\]/);
    if (!jsonMatch) {
      throw new Error("AI response does not contain valid JSON array");
    }

    const subtaskData = JSON.parse(`[${jsonMatch[1]}]`);

    if (!Array.isArray(subtaskData) || subtaskData.length === 0) {
      throw new Error("AI response is not a valid array of subtasks");
    }

    const subtasks: Task[] = subtaskData.map((subtask: any, index: number) => ({
      type: "subtask",
      id: `${task.id}-subtask-${Date.now()}-${index + 1}`,
      title:
        typeof subtask === "string"
          ? subtask
          : subtask.title || `Subtask ${index + 1}`,
      description: `Auto-generated subtask from: ${task.title}`,
      status: "todo" as const,
      priority: task.priority,
      dueDate: subtask.dueDate || task.dueDate,
      dueTime: subtask.dueTime || task.dueTime,
      startTime: subtask.startTime || task.startTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uid: task.uid,
    }));

    return subtasks;
  } catch (error) {
    console.error("Error splitting task:", error);
    throw new Error(
      `Failed to split task: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
