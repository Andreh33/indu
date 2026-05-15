'use client';

import { updateSocialsAction } from '@/server/actions/settings';
import SettingsFormShell from './settings-form-shell';

type Initial = {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
} | null;

export default function SocialsForm({ initial }: { initial: Initial }) {
  return (
    <SettingsFormShell action={updateSocialsAction}>
      <Input label="Instagram" name="instagram" defaultValue={initial?.instagram ?? ''} />
      <Input label="TikTok" name="tiktok" defaultValue={initial?.tiktok ?? ''} />
      <Input label="YouTube" name="youtube" defaultValue={initial?.youtube ?? ''} />
      <Input label="Twitter / X" name="twitter" defaultValue={initial?.twitter ?? ''} />
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
        type="url"
        {...props}
        className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
      />
    </label>
  );
}
