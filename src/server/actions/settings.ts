'use server';

import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { settings } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';

export type SettingsFormState = { error: string | null; ok?: true };

async function upsertSetting(key: string, value: unknown, actorId: string) {
  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (existing[0]) {
    await db.update(settings).set({ value, updatedBy: actorId }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value, updatedBy: actorId });
  }
  revalidateTag('settings', 'default');
  revalidateTag(`settings:${key}`, 'default');
}

const ContactSchema = z.object({
  whatsapp: z.string().regex(/^\d{8,15}$/, 'Solo dígitos, formato internacional sin "+"'),
  email: z.string().email().or(z.literal('')),
  address: z.string().max(200),
});

export async function updateContactAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireAdmin();
  const parsed = ContactSchema.safeParse({
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
    address: formData.get('address'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Inválido' };
  await upsertSetting('contact', parsed.data, session.uid);
  return { error: null, ok: true };
}

const AnnouncementSchema = z.object({
  enabled: z.boolean(),
  messages: z.array(z.string().min(1).max(120)).max(6),
});

export async function updateAnnouncementAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireAdmin();
  const messages =
    (formData.get('messages') as string | null)
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const parsed = AnnouncementSchema.safeParse({
    enabled: formData.get('enabled') === 'on',
    messages,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Inválido' };
  await upsertSetting('announcement_bar', parsed.data, session.uid);
  return { error: null, ok: true };
}

const AboutSchema = z.object({
  slogan: z.string().min(1).max(200),
  manifesto: z.string().min(1).max(4000),
  origin: z.string().max(4000),
});

export async function updateAboutAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireAdmin();
  const parsed = AboutSchema.safeParse({
    slogan: formData.get('slogan'),
    manifesto: formData.get('manifesto'),
    origin: formData.get('origin'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Inválido' };
  await upsertSetting('about', parsed.data, session.uid);
  return { error: null, ok: true };
}

const SocialsSchema = z.object({
  instagram: z.string().url().or(z.literal('')),
  tiktok: z.string().url().or(z.literal('')),
  youtube: z.string().url().or(z.literal('')),
  twitter: z.string().url().or(z.literal('')),
});

export async function updateSocialsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const session = await requireAdmin();
  const parsed = SocialsSchema.safeParse({
    instagram: formData.get('instagram') || '',
    tiktok: formData.get('tiktok') || '',
    youtube: formData.get('youtube') || '',
    twitter: formData.get('twitter') || '',
  });
  if (!parsed.success) return { error: 'URL inválida' };
  await upsertSetting('socials', parsed.data, session.uid);
  return { error: null, ok: true };
}
