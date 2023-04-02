import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"id" | "title" | "completed">(
    "id"
  );
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get<Todo[]>(
          "https://jsonplaceholder.typicode.com/todos"
        );
        setTodos(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodoTitle === "") {
      alert("A task cannot be empty");
      return;
    }
    const newTodoId = Math.max(...todos.map((todo) => todo.id)) + 1;
    const newTodo: Todo = {
      id: newTodoId,
      title: newTodoTitle,
      completed: false,
    };

    const index = todos.findIndex((todo) => {
      switch (sortField) {
        case "id":
          return sortDirection === "asc"
            ? newTodoId < todo.id
            : newTodoId > todo.id;
        case "title":
          return sortDirection === "asc"
            ? newTodo.title.localeCompare(todo.title) === -1
            : newTodo.title.localeCompare(todo.title) === 1;
        case "completed":
          return sortDirection === "asc"
            ? newTodo.completed && !todo.completed
            : todo.completed && !newTodo.completed;
        default:
          return false;
      }
    });

    if (index === -1) {
      setTodos([...todos, newTodo]);
    } else {
      const updatedTodos = [...todos];
      updatedTodos.splice(index, 0, newTodo);
      setTodos(updatedTodos);
    }
    setNewTodoTitle("");
    toggleSortDirection("id");
  };

  const toggleSortDirection = (field: "id" | "title" | "completed") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCompleteTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const sortedTodos = todos.sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "title":
        aValue = a.title;
        bValue = b.title;
        break;
      case "completed":
        aValue = a.completed;
        bValue = b.completed;
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  });

  return (
    <div className="container">
      <div className="App">
        <h1>Todo App</h1>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTodo();
            }}
          >
            <input
              className="text-field"
              type="text"
              placeholder="Enter a task..."
              value={newTodoTitle}
              onChange={handleNewTodoTitleChange}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSortDirection("id")}>ID</th>
                <th onClick={() => toggleSortDirection("title")}>Title</th>
                <th onClick={() => toggleSortDirection("completed")}>
                  Completed
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTodos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>{todo.completed ? "Yes" : "No"}</td>
                  <td>
                    {!todo.completed && (
                      <button onClick={() => handleCompleteTodo(todo.id)}>
                        Complete
                      </button>
                    )}
                    <button onClick={() => handleDeleteTodo(todo.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
