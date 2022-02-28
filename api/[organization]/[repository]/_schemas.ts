import Ajv, { JSONSchemaType } from "ajv";

const ajv = new Ajv();

type BatchSchema = {
  operation: "verify" | "upload" | "download";
  transfers: string[];
  objects: { oid: string; size: number }[];
};

const BATCH_SCHEMA: JSONSchemaType<BatchSchema> = {
  required: ["operation", "transfers", "objects"],
  type: "object",
  properties: {
    operation: {
      type: "string",
      enum: ["verify", "upload", "download"],
    },
    transfers: {
      type: "array",
      items: {
        type: "string",
      },
    },
    objects: {
      type: "array",
      items: {
        type: "object",
        required: ["oid", "size"],
        properties: {
          oid: {
            type: "string",
            pattern: "^[0-9a-f]{64}$",
          },
          size: {
            type: "number",
          },
        },
      },
    },
  },
} as const;

const validateBatchRequest = (json: any) => {
  const valid = ajv.validate(BATCH_SCHEMA, json);
  if (!valid) {
    throw new Error(ajv.errorsText());
  }

  return json;
};

// eslint-disable-next-line import/prefer-default-export
export { validateBatchRequest };
