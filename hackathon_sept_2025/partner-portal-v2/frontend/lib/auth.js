import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export function createToken(company) {
  return jwt.sign(
    { id: company.id, email: company.email, name: company.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function authenticateRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}