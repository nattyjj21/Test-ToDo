import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CheckCircle2, Shield, Zap, ArrowRight } from "lucide-react";

export default async function HomePage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Failed to retrieve session on HomePage:", error);
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold">
          <Zap className="w-4 h-4 text-indigo-600" />
          Streamlined Productivity with Next.js & Prisma
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Manage your tasks with <span className="text-indigo-600">simplicity</span> and speed.
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          TaskFlow keeps your daily work structured. Organize with priorities, deadlines, dynamic filters, and effortless task tracking.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold text-base transition"
              >
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Feature highlight tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Seamless CRUD & Filters</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create, edit, toggle, and delete tasks instantly. Filter smoothly across all, active, and completed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Secure Auth & Privacy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Session management powered by Auth.js and bcrypt password encryption. Only access your personal tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Priorities & Deadlines</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Assign Low, Medium, and High priorities with due dates to keep focus on high-impact objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
