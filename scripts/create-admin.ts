/**
 * Crear o resetear un usuario admin.
 *
 * Uso:
 *   pnpm db:create-admin -- <email> <password>
 *
 * Si el email ya existe, actualiza el password. Si no, crea el usuario.
 */
import { config as loadEnv } from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';

loadEnv({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error('TURSO_DATABASE_URL missing');

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Uso: pnpm db:create-admin -- <email> <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

async function main() {
  const passwordHash = await bcrypt.hash(password!, 12);
  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email!))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.adminUsers)
      .set({ passwordHash, firstLogin: false })
      .where(eq(schema.adminUsers.email, email!));
    console.log(`✅ Password actualizado para ${email}`);
  } else {
    await db.insert(schema.adminUsers).values({
      email: email!,
      passwordHash,
      displayName: email!.split('@')[0] ?? null,
      firstLogin: true,
    });
    console.log(`✅ Admin creado: ${email}`);
  }
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
