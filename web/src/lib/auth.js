export function saveSession({ token, user }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // { email, role }
  }
  
  export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  export function getUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  }
  
  export function isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  export function hasRole(role) {
    const u = getUser();
    return u?.role === role;
  }
  