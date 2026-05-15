import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';

export type AnnouncementBarSettings = { messages: string[]; enabled: boolean };
export type ContactSettings = { whatsapp: string; email: string; address: string };
export type SocialsSettings = {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
};

export async function getSetting<T>(key: string): Promise<T | null> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return (rows[0]?.value as T) ?? null;
}

export async function getContact(): Promise<ContactSettings> {
  const stored = await getSetting<ContactSettings>('contact');
  return (
    stored ?? {
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
      email: 'hola@industrialfighters.com',
      address: '',
    }
  );
}

export async function getAnnouncementBar(): Promise<AnnouncementBarSettings> {
  const stored = await getSetting<AnnouncementBarSettings>('announcement_bar');
  return (
    stored ?? {
      enabled: true,
      messages: [
        'ENVÍO 24/48H A TODA ESPAÑA. INTERNACIONAL CONSULTAR.',
        'PERSONALIZACIÓN INCLUIDA EN TODOS LOS PRODUCTOS.',
        'DE DONDE VENIMOS SE LUCHA CADA DÍA.',
      ],
    }
  );
}

export async function getSocials(): Promise<SocialsSettings> {
  const stored = await getSetting<SocialsSettings>('socials');
  return (
    stored ?? {
      instagram: 'https://instagram.com/industrialfighters',
    }
  );
}
