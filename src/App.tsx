import { useState, useEffect } from "react";
import "./App.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type SortOrder = "asc" | "desc";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Task>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const data = await response.json();
        const tasksData = data.map((task: Task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
        }));
        setTasks(tasksData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const sortTasks = (field: keyof Task) => {
    if (field === sortField) {
      // toggle order if sorting same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // set new field and ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedTasks = tasks.sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (a[sortField] > b[sortField]) {
      return order;
    }
    if (a[sortField] < b[sortField]) {
      return -order;
    }
    return 0;
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          <li onClick={() => sortTasks("id")}>
            <span>ID</span>
            <span>{sortField === "id" && sortOrder === "asc" ? "a" : "c"}</span>
          </li>
          <li onClick={() => sortTasks("title")}>
            <span>Name</span>
            <span>
              {sortField === "title" && sortOrder === "asc" ? "a" : "c"}
            </span>
          </li>
          <li onClick={() => sortTasks("completed")}>
            <span>Completed</span>
            <span>
              {sortField === "completed" && sortOrder === "asc" ? "a" : "c"}
            </span>
          </li>
          {sortedTasks.map((task) => (
            <li key={task.id}>
              <span>{task.id}</span>
              <span>{task.title}</span>
              <span>{task.completed ? "completed" : "not completed"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
