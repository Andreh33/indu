import 'server-only';
import { getSetting } from './settings';

export type AppDistribution = {
  /** URL pública del APK actual (Vercel Blob, R2, etc.) */
  apkUrl: string;
  /** Versión visible al usuario (semver corto: 1.0.3) */
  version: string;
  /** SHA256 del keystore para .well-known/assetlinks.json */
  sha256: string;
  /** Application ID del TWA (com.industrialfighters.app) */
  packageName: string;
  /** Mínima Android SDK soportada */
  minSdk: number;
};

const FALLBACK: AppDistribution = {
  apkUrl: '',
  version: '0.0.0',
  sha256: '',
  packageName: 'com.industrialfighters.twa',
  minSdk: 24,
};

export async function getAppDistribution(): Promise<AppDistribution> {
  const stored = await getSetting<Partial<AppDistribution>>('app_distribution');
  return { ...FALLBACK, ...(stored ?? {}) };
}
