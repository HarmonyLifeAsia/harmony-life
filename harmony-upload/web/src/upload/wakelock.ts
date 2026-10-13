import type { WakeLockLike } from "./engine.ts";

/**
 * Screen Wake Lock: tylko zapobiega wygaszaniu ekranu, dopóki strona jest widoczna.
 * To NIE jest upload w tle — po zablokowaniu telefonu lub zmianie aplikacji wysyłanie może się zatrzymać.
 * Brak wsparcia lub odmowa nie blokują przesyłania.
 */
export class ScreenWakeLock implements WakeLockLike {
  private sentinel: WakeLockSentinel | null = null;
  private wanted = false;

  async acquire(): Promise<boolean> {
    this.wanted = true;
    return this.request();
  }

  private async request(): Promise<boolean> {
    try {
      if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return false;
      const s = await navigator.wakeLock.request("screen");
      s.addEventListener("release", () => {
        if (this.sentinel === s) this.sentinel = null;
      });
      this.sentinel = s;
      return true;
    } catch {
      return false;
    }
  }

  /** System zwalnia blokadę przy ukryciu strony — po powrocie próbujemy ją odzyskać. */
  reacquireIfNeeded(): void {
    if (this.wanted && !this.sentinel) void this.request();
  }

  release(): void {
    this.wanted = false;
    const s = this.sentinel;
    this.sentinel = null;
    void s?.release().catch(() => undefined);
  }
}
