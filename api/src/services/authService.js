const jwt = require('jsonwebtoken');

const USERS = [
  { email: 'admin@ifrs.edu', password: '123456', role: 'admin' },
  { email: 'user@ifrs.edu',  password: '123456', role: 'user'  },
];

class AuthService {
  static login(email, password) {
    const u = USERS.find(x => x.email === email && x.password === password);
    if (!u) return null;
    const token = jwt.sign({ email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { email: u.email, role: u.role } };
  }
}

module.exports = AuthService;