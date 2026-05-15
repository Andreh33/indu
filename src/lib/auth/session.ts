import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'if-admin-session';
export const SESSION_MAX_AGE_S = 60 * 60 * 24; // 24h

export type SessionPayload = {
  uid: string;
  email: string;
};

function getKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set and >= 32 chars');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_S}s`)
    .setIssuer('industrial-fighters')
    .setAudience('admin')
    .sign(getKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      issuer: 'industrial-fighters',
      audience: 'admin',
    });
    if (typeof payload.uid !== 'string' || typeof payload.email !== 'string') return null;
    return { uid: payload.uid, email: payload.email };
  } catch {
    return null;
  }
}
