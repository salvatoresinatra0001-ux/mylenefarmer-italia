const KEY = "mf-edizione-promemoria";

export function readNotice(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { email?: string };
    return data.email ?? null;
  } catch {
    return null;
  }
}

export function saveNotice(email: string) {
  window.localStorage.setItem(KEY, JSON.stringify({ email, savedAt: new Date().toISOString() }));
}
