"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import { Plus, Calendar, Menu, X } from "lucide-react";
import { useModal, ModalProvider } from "@/context/ModalContext";
import { TaskProvider, useTasks } from "@/context/TasksContext";
import AddTask from "@/components/AddTask";
import EditTask from "@/components/EditTask";
import { AnimatePresence, motion } from "motion/react";
import Task from "@/types/task";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);
const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

function CalendarNavbar() {
  const { openAddModal } = useModal();
  const { toggleSidebar } = useSidebar();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="p-2 shadow-sm bg-[#111827]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          <Calendar className="h-6 w-6 text-white" />
          <span className="text-white font-medium hidden sm:inline">
            Today: {today}
          </span>
          <span className="text-white font-medium sm:hidden text-sm">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <button
          onClick={openAddModal}
          className="bg-accent/80 text-white px-3 sm:px-4 py-2 rounded-full hover:bg-accent/50 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Add Event</span>
        </button>
      </div>
    </nav>
  );
}

function GlobalModals() {
  const {
    addModalOpen,
    editModalOpen,
    currentTaskId,
    closeAddModal,
    closeEditModal,
  } = useModal();
  const { addNewTask, updateExistingTask, tasks } = useTasks();

  // Get current task from tasks array using the ID
  const currentTask = currentTaskId
    ? tasks.find((task) => task.id === currentTaskId)
    : null;

  const handleTaskAdded = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "uid">
  ) => {
    try {
      await addNewTask(taskData);
      closeAddModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskUpdated = async (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "uid">>
  ) => {
    try {
      await updateExistingTask(taskId, updates);
      closeEditModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {addModalOpen && (
          <AddTask
            isOpen={addModalOpen}
            setIsOpen={closeAddModal}
            onTaskAdded={handleTaskAdded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModalOpen && currentTask && (
          <EditTask
            isOpen={editModalOpen}
            setIsOpen={closeEditModal}
            task={currentTask}
            onTaskUpdated={handleTaskUpdated}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function TaskInitializer() {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    if (user && tasks.length === 0) {
      fetchTasks();
    }
  }, [user, fetchTasks, tasks.length]);

  return null;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isCalendarPage = pathname?.includes("/calendar");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar when route changes (mobile navigation)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <TaskProvider>
      <ModalProvider>
        <TaskInitializer />
        <SidebarContext.Provider
          value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
        >
          <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            <section className="flex min-h-screen relative">
              {/* Mobile Overlay */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  />
                )}
              </AnimatePresence>

              {/* Sidebar */}
              <div
                className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${
                  sidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
              `}
              >
                <AppSidebar />
                {/* Close button for mobile */}
                <button
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 lg:hidden text-white hover:text-accent transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col flex-grow lg:ml-0">
                {isCalendarPage ? (
                  <CalendarNavbar />
                ) : (
                  <AppNavbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onMenuClick={toggleSidebar}
                  />
                )}
                <main className="flex-grow">{children}</main>
              </div>
            </section>
            <GlobalModals />
          </SearchContext.Provider>
        </SidebarContext.Provider>
      </ModalProvider>
    </TaskProvider>
  );
}
