import type { VercelRequest, VercelResponse } from "@vercel/node";

const handler = async (_req: VercelRequest, res: VercelResponse) => {
  res.status(404).send("not found");
};

export default handler;
