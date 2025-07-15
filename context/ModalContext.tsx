"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type Task from "../types/task";

interface ModalContextType {
  addModalOpen: boolean;
  editModalOpen: boolean;
  currentTaskId: string | null;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (taskId: string) => void;
  closeEditModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (taskId: string) => {
    setCurrentTaskId(taskId);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentTaskId(null);
  };

  const value = {
    addModalOpen,
    editModalOpen,
    currentTaskId,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
