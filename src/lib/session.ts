/**
 * One conversation per visitor, shared by every place they can reach the
 * assistant — the floating widget, the /talk/ page and the Demo Lab voice
 * agent all quote the same id to the n8n workflow.
 *
 * Without this each surface opened its own thread, so someone who explained
 * their business to the voice agent had to explain it again the moment they
 * opened the widget. To the visitor it was obviously the same assistant the
 * whole time, so starting over read as a fault.
 *
 * sessionStorage, not localStorage: the thread should last a visit, not
 * follow someone back weeks later into a conversation they've forgotten.
 */

const KEY = "orviqo-conversation";

function mint(): string {
  return `orviqo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** The visitor's conversation id, creating one on first use. */
export function getSessionId(): string {
  if (typeof window === "undefined") return mint();
  try {
    const existing = window.sessionStorage.getItem(KEY);
    if (existing) return existing;
    const fresh = mint();
    window.sessionStorage.setItem(KEY, fresh);
    return fresh;
  } catch {
    // Private mode or blocked storage: still works, just per-surface.
    return mint();
  }
}

/** Starts a fresh thread — used when the visitor switches language. */
export function resetSessionId(): string {
  const fresh = mint();
  if (typeof window === "undefined") return fresh;
  try {
    window.sessionStorage.setItem(KEY, fresh);
  } catch {}
  return fresh;
}
