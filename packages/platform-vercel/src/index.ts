import { handle } from "hono/vercel";

import type { Dairi } from "@dairi/core";

let handler: ReturnType<typeof handle> | null = null;

const vercel = {
  get: (app: Dairi) => {
    if (handler) {
      return handler;
    }

    handler = handle(app.run());
    return handler;
  },
  post: (app: Dairi) => {
    if (handler) {
      return handler;
    }

    handler = handle(app.run());
    return handler;
  },
};

export { vercel };
