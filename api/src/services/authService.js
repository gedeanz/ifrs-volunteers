const jwt = require('jsonwebtoken');
const VolunteerModel = require('../models/volunteerModel');

class AuthService {
  static async login(email, password) {
    const volunteer = await VolunteerModel.findByEmail(email);
    
    if (!volunteer || volunteer.password !== password) {
      return null;
    }

    const token = jwt.sign(
      { 
        id: volunteer.id,
        email: volunteer.email,
        role: volunteer.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        role: volunteer.role,
      },
    };
  }
}

module.exports = AuthService;