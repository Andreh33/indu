'use client';

import { updateAnnouncementAction } from '@/server/actions/settings';
import SettingsFormShell from './settings-form-shell';

type Initial = { enabled: boolean; messages: string[] } | null;

export default function AnnouncementForm({ initial }: { initial: Initial }) {
  return (
    <SettingsFormShell action={updateAnnouncementAction}>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={initial?.enabled ?? true}
          className="h-4 w-4 accent-[var(--color-blood-400)]"
        />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-canvas-0)]">
          Mostrar barra
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          Mensajes (uno por línea, máx. 6)
        </span>
        <textarea
          name="messages"
          rows={4}
          defaultValue={(initial?.messages ?? []).join('\n')}
          className="border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-canvas-0)] focus:border-[var(--color-blood-400)] focus:outline-none"
        />
      </label>
    </SettingsFormShell>
  );
}
