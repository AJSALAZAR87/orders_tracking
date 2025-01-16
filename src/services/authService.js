const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersRepository = require('../repositories/usersRepository');
const logger = require('../utils/logger');


const signUp = async (userData) => {
  try {
    const { name, last_name, email, password, role } = userData;

    // Check if the user already exists
    const existingUser = await usersRepository.findByEmailRepository(email);
    if (existingUser) {
        throw new Error('Email already in use');
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await usersRepository.inserUserRepository({
        name,
        last_name,
        email,
        role,
        password: hashedPassword,
    });

    // Token generation
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return { user, token, refreshToken };
  } catch (err) {
    throw new Error(`Error in authService: ${err.message}`);
  }
    
};

const login = async (email, password) => {
  try {
    // Check if user exists
    const user = await usersRepository.findByEmailRepository(email);
    if (!user) {
        throw new Error('User not found');
    }

    // Password verification
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Token Generation
    const token = jwt.sign(
      { id: user.id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Refresh token generation
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { user: { id: user.id, name: user.name, email: user.email }, token, refreshToken };
  } catch (err) {
    throw new Error(`Error in authService: ${err.message}`);
  }
};

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await usersRepository.findByEmailRepository(decoded.email);
    if (!existingUser) {
        throw new Error('Email not in registered in the system');
    }
    const newAccessToken = jwt.sign(
        { id: existingUser.id, email:existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { accessToken: newAccessToken };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired, please log in again');
    }
    throw new Error(`Invalid or expired refresh token: ${err.message}`);
  }
};

const updateUser = async (id, fields) => {
  try {
    let updatedCase;
    if ('password' in fields){
      const { password, ...rest } = fields;
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedCase = await usersRepository.updateUserRepository(id, { ...rest, password: hashedPassword} );
    } else{
      updatedCase = await usersRepository.updateUserRepository(id, fields );
    }
    return updatedCase;
  } catch (err) {
    throw new Error(`Error in Authservice: ${err.message}`);
  }
}

const getUsers = async (req) => {
  try {
    logger.info('All users have been retrieved');
    return await usersRepository.getUsersRepository(req); 
  } catch (error) {
    throw new Error(`Error in getUsers Authservice: ${error.message}`);
  }
}

const getUserById = async (id) => {
  try {
    logger.info('User has been retrieved');
    return await usersRepository.getUserByIdRepository(id); 
  } catch (error) {
    throw new Error(`Error in getUserById Authservice: ${error.message}`);
  }
}

module.exports = {
  login,
  signUp,
  updateUser,
  refreshToken,
  getUsers,
  getUserById,
}