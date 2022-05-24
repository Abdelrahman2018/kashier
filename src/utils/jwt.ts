import JWT from 'jsonwebtoken';
import config from '../config';

var defaultPayload = {
  iss: 'kashier',
  aud: 'users',
  iat: Math.floor(Date.now() / 1000) - 30,
};

export const generateAccessToken = (userId: string, role: string) => {
  // payload == claims
  const payload = {
    ...defaultPayload,
    sub: userId,
    role: role,
  };

  const expiry = { expiresIn: '7d' };

  return JWT.sign(payload, config.JWT_ACCESS_SECRET, expiry);
};

export const generateRefreshToken = (id: string) => {
  const payload = {
    ...defaultPayload,
    sub: id,
  };

  const expiry = { expiresIn: '48h' };

  return JWT.sign(payload, config.JWT_REFRESH_SECRET, expiry);
};

export const verifyAccessToken = (token: string) =>
  JWT.verify(token, config.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token: string) =>
  JWT.verify(token, config.JWT_REFRESH_SECRET);
