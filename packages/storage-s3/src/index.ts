import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { DairiStorageMiddleware } from "@dairi/core";

type S3StorageArgs = {
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
  expiry: number;
  region: string;
};

const s3 = (opts: S3StorageArgs): DairiStorageMiddleware => {
  const client = opts.endpoint
    ? new S3Client({
        endpoint: opts.endpoint,
        region: opts.region,
        credentials: opts.credentials,
      })
    : new S3Client({
        region: opts.region,
        credentials: opts.credentials,
      });

  const getStoragePrefix = (
    username?: string,
    repository?: string
  ): string | undefined => {
    const str: string[] = [];

    if (username) {
      str.push(username);
    }

    if (repository) {
      str.push(repository);
    }

    return str.length === 0 ? undefined : str.join("/");
  };

  return {
    name: "s3-storage",
    type: "storage",
    getDownloadUri: async (args) => {
      const prefix = getStoragePrefix(args.username, args.repository);
      const command = new GetObjectCommand({
        Bucket: opts.bucket,
        Key: prefix ? `${prefix}/${args.oid}` : args.oid,
      });

      const uri = await getSignedUrl(client, command, {
        expiresIn: opts.expiry,
      });
      return { uri };
    },
    getUploadUri: async (args) => {
      const prefix = getStoragePrefix(args.username, args.repository);
      const command = new PutObjectCommand({
        Bucket: opts.bucket,
        Key: prefix ? `${prefix}/${args.oid}` : args.oid,
        ContentType: "application/octet-stream",
      });

      const uri = await getSignedUrl(client, command, {
        expiresIn: opts.expiry,
      });
      return { uri };
    },
  };
};

export { s3 };
export type { S3StorageArgs };
