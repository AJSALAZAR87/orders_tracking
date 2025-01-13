const authService = require('../services/authService');
const { validationResult, body } = require('express-validator');


const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const result = await authService.signUp(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const refreshToken = async (req, res) => {
  try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });

      const result = await authService.refreshToken(refreshToken);
      res.status(200).json(result);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = req.body;
  try {
    const updatedUser = await authService.updateUser(userId, user);
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getUsers = async(req, res) => {
  try {
    const users = await authService.getUsers(req);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const getUserById = async(req, res) => {
  const { userId } = req.params;
  try {
    const users = await authService.getUserById(userId);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  signUp,
  login,
  refreshToken,
  updateUser,
  getUsers,
  getUserById
}