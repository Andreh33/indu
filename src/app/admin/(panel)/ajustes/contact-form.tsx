'use client';

import { updateContactAction } from '@/server/actions/settings';
import SettingsFormShell from './settings-form-shell';

type Initial = { whatsapp: string; email: string; address: string } | null;

export default function ContactForm({ initial }: { initial: Initial }) {
  return (
    <SettingsFormShell action={updateContactAction}>
      <Input
        label="WhatsApp (formato internacional sin +)"
        name="whatsapp"
        defaultValue={initial?.whatsapp ?? ''}
        placeholder="34612345678"
        required
      />
      <Input label="Email" name="email" defaultValue={initial?.email ?? ''} type="email" />
      <Input label="Dirección" name="address" defaultValue={initial?.address ?? ''} />
    </SettingsFormShell>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {label}
      </span>
      <input
        {...props}
        className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
      />
    </label>
  );
}
