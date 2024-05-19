import { login, logout } from '../repositories/users.js';

export async function loginController(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Bad Request');
  }

  try {
    const user = await login(username, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}


export async function logoutController(req, res) {
  const token = req.headers['x-authorization'];
  try {
    await logout(token);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}
