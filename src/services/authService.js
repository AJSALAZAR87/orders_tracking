const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersRepository = require('../repositories/usersRepository');
const logger = require('../utils/logger');


const signUp = async (userData) => {
  try {
    const { name, last_name, email, password } = userData;

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
        password: hashedPassword,
    });

    // Token generation
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  } catch (err) {
    throw new Error(`Error in authService: ${err.message}`);
  }
    
};

const login = async (email, password) => {
  try {
    // Check if user exists
    const user = await usersRepository.findByEmailRepository(email);
    console.log('User retrieved: ', user)
    if (!user) {
        throw new Error('User not found');
    }

    // Password verification
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Token Generation
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  } catch (err) {
    throw new Error(`Error in authService: ${err.message}`);
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

module.exports = {
  login,
  signUp,
  updateUser,
}