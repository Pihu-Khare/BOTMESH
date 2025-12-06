import jwt from 'jsonwebtoken';
import { config } from '../../config/environment.js';

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default { generateToken, verifyToken, decodeToken };
