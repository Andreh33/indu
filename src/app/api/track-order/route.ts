import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { orderAttempts } from '@/lib/db/schema';

const Schema = z.object({
  items: z.array(z.unknown()).min(1).max(50),
  totalCents: z.number().int().nonnegative(),
});

function truncateIp(ip: string): string {
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 4).join(':') + '::/64';
  }
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  return ip;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const ipRaw = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ?? '';
  const ipTruncated = ipRaw ? truncateIp(ipRaw) : null;
  const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 500);

  try {
    await db.insert(orderAttempts).values({
      items: parsed.data.items,
      totalCents: parsed.data.totalCents,
      ipTruncated,
      userAgent,
    });
  } catch (err) {
    console.error('[track-order]', err);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
