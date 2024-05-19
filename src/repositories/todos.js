import { randomUUID } from 'node:crypto';

export const toDos = [];

export function listTodos() {
  return Promise.resolve(toDos);
}

export function getTodo(id) {
  const todo = toDos.find(todo => todo.id === id);
  return Promise.resolve(todo);
}

export function createTodo({ title, completed }) {
  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    throw new Error('Invalid data');
  }

  const todo = {
    id: randomUUID(),
    title,
    completed
  };
  toDos.push(todo);
  return Promise.resolve(todo);
}

export function updateTodo(id, { title, completed }) {
  const todoIndex = toDos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return Promise.resolve(null);
  }
  const todo = toDos[todoIndex];
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  return Promise.resolve(todo);
}

export function deleteTodo(id) {
  const todoIndex = toDos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return Promise.resolve(false);
  }
  toDos.splice(todoIndex, 1);
  return Promise.resolve(true);
}
