import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Access token is short-lived

export const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
