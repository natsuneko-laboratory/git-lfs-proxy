import { handle } from "hono/vercel";

import type { DairiPlatformMiddleware } from "@dairi/core";

const vercel = (): DairiPlatformMiddleware => ({
  name: "vercel-platform",
  type: "platform",
  getHandler: (server) => handle(server),
});

export { vercel };
