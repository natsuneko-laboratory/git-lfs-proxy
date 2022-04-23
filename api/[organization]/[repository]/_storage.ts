import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.AWS_S3_BUCKET as string;
const expiry = Number(process.env.AWS_S3_SIGN_EXPIRE as string);

const client = new S3Client({
  endpoint: process.env.AWS_S3_ENDPOINT as string,
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

const getPresignedUrl = async (oid: string, verb: "GET" | "PUT") => {
  if (verb === "GET") {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: oid,
    });

    return getSignedUrl(client, command, { expiresIn: expiry });
  }

  if (verb === "PUT") {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: oid,
      ContentType: "application/octet-stream",
    });

    return getSignedUrl(client, command, { expiresIn: expiry });
  }

  throw new Error("not supported verb");
};

const getUriForDownload = async (oid: string, prefix: string) => ({
  uri: await getPresignedUrl(`${prefix}/${oid}`, "GET"),
  expiry,
  size: undefined,
});

const getUriForUpload = async (oid: string, prefix: string) => ({
  uri: await getPresignedUrl(`${prefix}/${oid}`, "PUT"),
  expiry,
  headers: { "Content-Type": "application/octet-stream" },
});

export { getUriForDownload, getUriForUpload };
