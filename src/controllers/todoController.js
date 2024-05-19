import { listTodos, getTodo, createTodo, updateTodo, deleteTodo } from '../repositories/todos.js';

export async function listTodosController(req, res) {
  try {
    const todos = await listTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

export async function getTodoController(req, res) {
  const { id } = req.params;
  try {
    const todo = await getTodo(id);
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

export async function createTodoController(req, res) {
  const { title } = req.body;

  try {
    const todo = await createTodo({
      title,
      completed: false
    });
    res.status(201).json(todo);
  } catch (error) {
    if (error.message === 'Invalid data') {
      return res.status(400).send('Bad Request');
    }
    res.status(500).send('Internal Server Error');
  }
}
export async function updateTodoController(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  if ((title && typeof title !== 'string') || (completed && typeof completed !== 'boolean')) {
    return res.status(400).send('Bad Request');
  }

  try {
    const todo = await updateTodo(id, { title, completed });
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

export async function deleteTodoController(req, res) {
  const { id } = req.params;
  try {
    const success = await deleteTodo(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}
