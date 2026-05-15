'use client';

import { updateAppDistributionAction } from '@/server/actions/settings';
import SettingsFormShell from './settings-form-shell';

type Initial = {
  apkUrl?: string;
  version?: string;
  sha256?: string;
  packageName?: string;
  minSdk?: number;
} | null;

export default function AppDistributionForm({ initial }: { initial: Initial }) {
  return (
    <SettingsFormShell action={updateAppDistributionAction}>
      <Input
        label="URL del APK (Vercel Blob / R2 / Supabase Storage)"
        name="apkUrl"
        type="url"
        defaultValue={initial?.apkUrl ?? ''}
        placeholder="https://blob.../industrial-fighters-1.0.0.apk"
      />
      <Input
        label="Versión (semver corto)"
        name="version"
        defaultValue={initial?.version ?? ''}
        placeholder="1.0.0"
      />
      <Input
        label="Package name"
        name="packageName"
        defaultValue={initial?.packageName ?? 'com.industrialfighters.twa'}
        required
      />
      <Input
        label="SHA256 del keystore (para assetlinks.json)"
        name="sha256"
        defaultValue={initial?.sha256 ?? ''}
        placeholder="AA:BB:CC:DD:..."
      />
      <Input
        label="Min SDK"
        name="minSdk"
        type="number"
        defaultValue={(initial?.minSdk ?? 24).toString()}
      />
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
