import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";

test("renders the app with a list of todos", async () => {
  render(<App />);
  const todo1 = await screen.findByText("delectus aut autem");
  const todo2 = await screen.findByText("quis ut nam facilis et officia qui");
  const todo3 = await screen.findByText("fugiat veniam minus");
  expect(todo1).toBeInTheDocument();
  expect(todo2).toBeInTheDocument();
  expect(todo3).toBeInTheDocument();
});

test("adds a new todo to the list", async () => {
  render(<App />);
  const newTodoInput = screen.getByPlaceholderText("Add a new todo");
  const addButton = screen.getByText("Add Todo");
  fireEvent.change(newTodoInput, { target: { value: "Test todo" } });
  fireEvent.click(addButton);
  const newTodo = await screen.findByText("Test todo");
  expect(newTodo).toBeInTheDocument();
});

test("completes a todo", async () => {
  render(<App />);
  const completeButton = screen.getByText("Complete");
  fireEvent.click(completeButton);
  const completedTodo = await screen.findByText("Completed: true");
  expect(completedTodo).toBeInTheDocument();
});

test("deletes a todo", async () => {
  render(<App />);
  const deleteButton = screen.getByText("Delete");
  fireEvent.click(deleteButton);
  const deletedTodo = await screen.findByText("delectus aut autem", {
    exact: false,
  });
  expect(deletedTodo).not.toBeInTheDocument();
});
