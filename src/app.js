import express from 'express';
import { loginController, logoutController } from './controllers/authController.js';
import { listTodosController, getTodoController, createTodoController, updateTodoController, deleteTodoController } from './controllers/todoController.js';
import { validate } from './middlewares/validate.js';
import { loginSchema } from './schemas/userSchema.js';
import { createTodoSchema, updateTodoSchema } from './schemas/todoSchema.js';
import { users } from './repositories/users.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/api', (req, res) => {
  res.type('text/plain').status(200).send('Hello World!');
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-authorization'];
  if (!token) return res.sendStatus(401);
  const user = users.find(user => user.token === token);
  if (!user) return res.sendStatus(401);
  req.user = user;
  next();
};

app.post('/api/login', validate(loginSchema), loginController);
app.post('/api/logout', authenticateToken, logoutController);

app.get('/api/todos', authenticateToken, listTodosController);
app.get('/api/todos/:id', authenticateToken, getTodoController);
app.post('/api/todos', authenticateToken, validate(createTodoSchema), createTodoController);
app.put('/api/todos/:id', authenticateToken, validate(updateTodoSchema), updateTodoController);
app.delete('/api/todos/:id', authenticateToken, deleteTodoController);

export default app;
