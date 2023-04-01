import React, { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tasks.map((task: Task) => (
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
