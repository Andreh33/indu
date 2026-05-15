'use client';

import { updateAboutAction } from '@/server/actions/settings';
import SettingsFormShell from './settings-form-shell';

type Initial = { slogan: string; manifesto: string; origin: string } | null;

export default function AboutForm({ initial }: { initial: Initial }) {
  return (
    <SettingsFormShell action={updateAboutAction}>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Slogan
        </span>
        <input
          name="slogan"
          defaultValue={initial?.slogan ?? ''}
          className="h-11 border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Manifiesto
        </span>
        <textarea
          name="manifesto"
          rows={6}
          defaultValue={initial?.manifesto ?? ''}
          className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Origen (historia)
        </span>
        <textarea
          name="origin"
          rows={5}
          defaultValue={initial?.origin ?? ''}
          className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      </label>
    </SettingsFormShell>
  );
}
