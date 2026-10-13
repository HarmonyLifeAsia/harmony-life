import type { EngineEnv } from "./engine.ts";

/** Środowisko przeglądarki dla silnika: czas, losowość, stan sieci i przerywane „spanie” (budzone przez `online`). */
export const browserEnv: EngineEnv = {
  now: () => Date.now(),
  random: () => Math.random(),
  isOnline: () => navigator.onLine,
  sleep: (ms, signal) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
      const done = () => {
        clearTimeout(timer);
        window.removeEventListener("online", wake);
        signal.removeEventListener("abort", abort);
      };
      const wake = () => {
        done();
        resolve();
      };
      const abort = () => {
        done();
        reject(new DOMException("Aborted", "AbortError"));
      };
      const timer = setTimeout(wake, ms);
      window.addEventListener("online", wake);
      signal.addEventListener("abort", abort);
    }),
};
