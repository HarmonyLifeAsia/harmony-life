import { handle, scheduled } from "./app.ts";
import type { Env } from "./env.ts";

export default {
  fetch(request, env) {
    return handle(request, env);
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      scheduled(env).then(
        (summary) => console.log("cleanup", JSON.stringify(summary)),
        (e) => console.error("cleanup failed", e instanceof Error ? e.message : String(e)),
      ),
    );
  },
} satisfies ExportedHandler<Env>;
