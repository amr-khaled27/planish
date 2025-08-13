import { Plus } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { motion } from "motion/react";

type AddTaskComponentProps = {
  style?: string;
}

export default function AddTaskComponent({style}: AddTaskComponentProps) {
  const { openAddModal } = useModal();

  return (
    <motion.button
      onClick={openAddModal}
      className={`bg-accent/80 text-white px-4 py-2 rounded-full hover:bg-accent/50 transition-colors flex items-center ${style}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus className="w-6 h-6" />
      <span className="ml-2">Add Tasks</span>
    </motion.button>
  );
}