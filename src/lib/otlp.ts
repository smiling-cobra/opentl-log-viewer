import type {
  IAnyValue,
  IKeyValue,
} from "@opentelemetry/otlp-transformer/build/src/common/internal-types";

export const toMs = (timeUnixNano: unknown): number => {
  if (typeof timeUnixNano === "string") {
    return Number(BigInt(timeUnixNano) / 1_000_000n);
  }
  return 0;
};

export const anyValueToString = (value: IAnyValue): string =>
  JSON.stringify(value);

export const getAttr = (attrs: IKeyValue[], key: string): string => {
  const entry = attrs.find((a) => a.key === key);

  if (!entry) {
    console.warn(`Attribute ${key} not found in resource attributes`);
    return "";
  }

  const entryValue = entry.value;
  return entryValue.stringValue ?? anyValueToString(entryValue);
};
