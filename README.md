# Dairi: Self-Hosted Git LFS Proxy

Dairi - _**\[代理\] means proxy in Japanese**_ - is a small, simple, and customizable Git LFS Proxy for the Edges.  
It works on Serverless Edge Platforms such as Cloudflare Workers, Deno, Vercel, AWS Lambda, Lambda@Edge, and Node.js.

```typescript
// app/api/[...route]/route.ts
import { Dairi } from "dairi";
import { vercel } from "@dairi/platform-vercel";

const app = new Dairi({ basePath: "/api" });

export const GET = vercel.get(app);
export const POST = vercel.post(app);

export const config = {
  runtime: "edge",
};
```

## License

MIT by [@6jz](https://twitter.com/6jz)
