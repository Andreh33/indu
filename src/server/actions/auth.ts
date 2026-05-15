'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { verifyPassword } from '@/lib/auth/password';
import { COOKIE_NAME, SESSION_MAX_AGE_S, signSession } from '@/lib/auth/session';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  next: z.string().optional(),
});

export type LoginState = { error: string | null };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
  });
  if (!parsed.success) {
    return { error: 'Email o contraseña inválidos.' };
  }

  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, parsed.data.email.toLowerCase()))
    .limit(1);
  const user = rows[0];
  if (!user) {
    // Hash decoy to avoid timing leak
    await verifyPassword(parsed.data.password, '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali');
    return { error: 'Credenciales incorrectas.' };
  }
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return { error: 'Credenciales incorrectas.' };
  }

  const token = await signSession({ uid: user.id, email: user.email });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_S,
  });

  const safeNext =
    parsed.data.next && parsed.data.next.startsWith('/admin') ? parsed.data.next : '/admin';
  redirect(safeNext);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect('/admin/login');
}
