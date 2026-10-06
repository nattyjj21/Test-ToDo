import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";
import { TaskWithDates } from "@/types/task";

export const metadata = {
  title: "Dashboard - TaskFlow",
  description: "Manage your tasks and to-dos",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch initial tasks on the server (Server Component)
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [
      { completed: "asc" },
      { createdAt: "desc" },
    ],
  });

  // Serialize dates for Client Component boundary
  const serializedTasks: TaskWithDates[] = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-900/50 py-6">
      <DashboardClient
        initialTasks={serializedTasks}
        userName={session.user.name || session.user.email}
      />
    </div>
  );
}
