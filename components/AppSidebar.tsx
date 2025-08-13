"use client";
import { ListChecks } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/app") {
      return pathname === "/app";
    }
    return pathname?.includes(path);
  };

  return (
    <aside className="w-64 bg-[#111827] sticky top-0 text-white h-screen p-4">
      <Link href="/" className="flex items-center justify-center mb-6">
        <ListChecks className="inline-block mr-2 text-3xl text-accent" />
        <span className="text-accent text-white font-semibold">Planish</span>
      </Link>
      <nav>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => router.push("/app")}
              className={`hover:text-accent transition-colors cursor-pointer text-left w-full p-2 rounded ${
                isActive("/app") ? "bg-accent/80 hover:text-white" : ""
              }`}
            >
              Tasks
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/app/calendar")}
              className={`hover:text-accent transition-colors cursor-pointer text-left w-full p-2 rounded ${
                isActive("/app/calendar") ? "bg-accent/80 hover:text-white" : ""
              }`}
            >
              Calendar
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/app/study")}
              className={`hover:text-accent transition-colors cursor-pointer text-left w-full p-2 rounded ${
                isActive("/app/study") ? "bg-accent/80 hover:text-white" : ""
              }`}
            >
              Study
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/app/ai")}
              className={`hover:text-accent transition-colors cursor-pointer text-left w-full p-2 rounded ${
                isActive("/app/ai") ? "bg-accent/80 hover:text-white" : ""
              }`}
            >
              AI Planner
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
