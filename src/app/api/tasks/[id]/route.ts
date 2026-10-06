import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validations";

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/tasks/:id
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Not your task" }, { status: 403 });
    }

    const body = await req.json();
    const result = taskUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      priority?: string;
      dueDate?: Date | null;
    } = {};

    if (result.data.title !== undefined) updateData.title = result.data.title.trim();
    if (result.data.description !== undefined) {
      updateData.description = result.data.description ? result.data.description.trim() : null;
    }
    if (result.data.completed !== undefined) updateData.completed = result.data.completed;
    if (result.data.priority !== undefined) updateData.priority = result.data.priority;
    if (result.data.dueDate !== undefined) {
      updateData.dueDate = result.data.dueDate ? new Date(result.data.dueDate) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/:id
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Not your task" }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted successfully", id });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
