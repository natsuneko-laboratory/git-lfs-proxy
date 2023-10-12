# `@natsuneko-laboratory/platform-vercel`

Vercel provider for Dairi.

```typescript
import { Dairi } from "dairi";
import { vercel } from "@dairi/platform-vercel";

const app = new Dairi({ basePath: "/api" });
app.use(vercel());

const handler = app.run();
export const GET = handler;
export const POST = handler;

export const config = {
  runtime: "edge",
};
```

## License

MIT by [@6jz](https://twitter.com/6jz)
