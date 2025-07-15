import { NextRequest, NextResponse } from "next/server";
import { splitTask } from "@/lib/model";
import Task from "@/types/task";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.task) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 });
    }

    const task: Task = body.task;
    const currentOtherActiveTasks: Task[] = body.currentOtherActiveTasks || [];

    if (!task.id || !task.title || !task.uid) {
      return NextResponse.json(
        { error: "Task must have id, title, and uid fields" },
        { status: 400 }
      );
    }

    const subtasks = await splitTask(task, currentOtherActiveTasks);

    return NextResponse.json({
      success: true,
      subtasks: subtasks,
      message: `Successfully split task into ${subtasks.length} subtasks`,
    });
  } catch (error) {
    console.error("Error in split-task API:", error);

    return NextResponse.json(
      {
        error: "Failed to split task",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
