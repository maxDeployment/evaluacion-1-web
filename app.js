import express from 'express'
import { scrypt, randomBytes, randomUUID } from 'node:crypto'

const app = express()

const users = [{
	username: 'admin',
	name: 'Gustavo Alfredo Marín Sáez',
	password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
}]
const todos = []

app.use(express.static('public'))

// Su código debe ir aquí...

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-authorization'];
  if (!token) return res.sendStatus(401);

  const user = users.find(user => user.token === token);
  if (!user) return res.sendStatus(401);
  req.user = user;
  next();
};

app.get('/api', (req, res) => {
  res.type('text/plain').status(200).send('Hello World!');
});

app.post('/api/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('username y password son requeridos');
  }

  const user = users.find(u => u.username === username);
  if (!user) return res.sendStatus(401);

  const [salt, storedHash] = user.password.split(':');
  scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) throw err;
    if (derivedKey.toString('hex') === storedHash) {
      if (!user.token) {
        user.token = randomBytes(48).toString('hex');
      }
      res.status(200).json({ username: user.username, name: user.name, token: user.token });
    } else {
      res.sendStatus(401);
    }
  });
});

app.get('/api/todos', authenticateToken, (req, res) => {
  res.json(todos);
});

app.get('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const todo = todos.find(todo => todo.id === id);
  
  if (!todo) {
    return res.status(404).send('El item no existe');
  }

  res.status(200).json(todo);
});

app.post('/api/todos', express.json(), authenticateToken, (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('El título es requerido');
  }

  const newTodo = {
    id: randomUUID(),
    title,
    completed: false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', express.json(), authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (title !== undefined && typeof title !== 'string') {
    return res.sendStatus(400);
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.sendStatus(400);
  }

  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return res.sendStatus(404);

  const todo = todos[todoIndex];

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return res.sendStatus(404);

  todos.splice(todoIndex, 1);

  res.sendStatus(204);
});

// ... hasta aquí

export default app