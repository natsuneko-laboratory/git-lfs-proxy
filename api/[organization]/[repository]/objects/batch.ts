import type { VercelRequest, VercelResponse } from "@vercel/node";
import { hasRepositoryAccess } from "../_authenticate";

import { validateBatchRequest } from "../_schemas";
import { getUriForDownload, getUriForUpload } from "../_storage";

const read = async (req: VercelRequest): Promise<string> => {
  const body: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const json = Buffer.concat(body).toString();
      try {
        resolve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", () => {
      reject();
    });
  });
};

const uploadObjects = (
  objects: { oid: string; size: number }[],
  prefix: string
) =>
  Promise.all(
    objects.map(async (object) => {
      const o = await getUriForUpload(object.oid, prefix);
      return {
        oid: object.oid,
        size: object.size,
        authenticated: true,
        actions: {
          upload: {
            href: o.uri,
            expiresIn: o.expiry,
            headers: o.headers,
          },
        },
        error: null,
      };
    })
  );

const downloadObjects = (
  objects: { oid: string; size: number }[],
  prefix: string
) =>
  Promise.all(
    objects.map(async (object) => {
      try {
        const o = await getUriForDownload(object.oid, prefix);
        return {
          oid: object.oid,
          size: object.size,
          authenticated: true,
          actions: {
            download: {
              href: o.uri,
              expiresIn: o.expiry,
              headers: {},
            },
          },
        };
      } catch (err) {
        return {
          oid: object.oid,
          size: object.size,
          error: {
            code: 500,
            message: JSON.stringify(err),
          },
        };
      }
    })
  );

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { organization, repository } = req.query;
  const authentication = req.headers.authorization as string | undefined;
  if (!authentication) {
    res.status(401).send("authorization header is required");
    return;
  }

  if (!authentication.startsWith("Basic")) {
    res.status(401).send("authorization header must be basic");
    return;
  }

  const [username, password] = Buffer.from(
    authentication.substring("Basic ".length).trim(),
    "base64"
  )
    .toString()
    .split(":");

  const body = await read(req);
  const json = validateBatchRequest(body);
  const permissions = json.operation === "upload" ? ["push"] : ["pull"];
  const hasPermission = await hasRepositoryAccess(
    organization as string,
    repository as string,
    username,
    password,
    permissions
  );

  if (!hasPermission) {
    res
      .status(400)
      .send(
        `user ${username} does not have ${permissions} access to ${organization}/${repository}`
      );
    return;
  }

  const prefix = `${organization}/${repository}`;

  if (json.operation === "upload") {
    const response = {
      transfer: "basic",
      objects: await uploadObjects(json.objects, prefix),
    };
    res.status(200).json(response);

    return;
  }

  if (json.operation === "download") {
    const response = {
      transfer: "basic",
      objects: await downloadObjects(json.objects, prefix),
    };
    res.status(200).json(response);
  }
};

export default handler;
