import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import app from "@/lib/firebase";
import Task from "@/types/task";
import { query, where, limit } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";

const db = getFirestore(app);

export async function getAllTasks(uid: string): Promise<Task[]> {
  const tasksCol = collection(db, "tasks");
  const q = query(
    tasksCol,
    where("uid", "==", uid),
    limit(10)
  );
  const snapshot = await getDocs(q);

  const tasks = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as Task;
  });

  // Sort by createdAt on client side
  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getTasksPaginated(
  uid: string,
  pageSize: number = 10,
  page: number = 0
): Promise<{
  tasks: Task[];
  hasMore: boolean;
  totalFetched: number;
}> {
  const tasksCol = collection(db, "tasks");
  
  // Fetch more documents than needed to check for more pages
  const fetchSize = (page + 1) * pageSize + 1;
  
  const q = query(
    tasksCol,
    where("uid", "==", uid),
    limit(fetchSize)
  );

  const snapshot = await getDocs(q);
  const allTasks = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Task)
  );

  // Sort by createdAt on client side
  const sortedTasks = allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Calculate pagination
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const tasks = sortedTasks.slice(startIndex, endIndex);
  const hasMore = sortedTasks.length > endIndex;

  return {
    tasks,
    hasMore,
    totalFetched: sortedTasks.length,
  };
}

export async function addTask(
  uid: string,
  task: Omit<Task, "id" | "uid" | "createdAt" | "updatedAt">
): Promise<string> {
  const tasksCol = collection(db, "tasks");
  const now = new Date().toISOString();

  const docRef = await addDoc(tasksCol, {
    ...task,
    uid,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskDoc = doc(db, "tasks", taskId);
  await deleteDoc(taskDoc);
}

export async function updateTask(
  uid: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const taskDoc = doc(db, "tasks", taskId);
  await updateDoc(taskDoc, updates);
}
