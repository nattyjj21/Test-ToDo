"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CheckSquare, LogOut, User, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white tracking-tight">
            Task<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                  {session.user?.name || session.user?.email}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition shadow-indigo-600/25"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
