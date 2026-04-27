import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
