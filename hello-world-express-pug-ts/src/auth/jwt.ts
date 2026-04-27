import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  provider: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRY = '24h';

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function refreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return generateToken(payload);
}
