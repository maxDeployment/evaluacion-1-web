import { scrypt, randomBytes } from 'node:crypto';
import util from 'util';

const scryptPromise = util.promisify(scrypt);

export const users = [{
  username: 'admin',
  name: 'Gustavo Alfredo Marín Sáez',
  password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01'
}];

export async function login(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) return null;

  const [salt, storedHash] = user.password.split(':');
  const derivedKey = await scryptPromise(password, salt, 64);

  if (derivedKey.toString('hex') === storedHash) {
    user.token = randomBytes(48).toString('hex');
    return {
      username: user.username,
      name: user.name,
      token: user.token
    };
  }
  return null;
}

export async function logout(token) {
  const user = users.find(u => u.token === token);
  if (user) {
    delete user.token;
    return true;
  }
  return false;
}
