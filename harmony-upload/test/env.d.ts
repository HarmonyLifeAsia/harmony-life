import type { Env as WorkerEnv } from "../src/worker/env.ts";

declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {
      MIGRATIONS: string;
    }
  }
}
