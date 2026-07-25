import type { DetailEntry } from "./types/school.types";

export function recordToEntries(
  record: Record<string, string | number | boolean> | null | undefined,
): DetailEntry[] {
  if (!record) return [];
  return Object.entries(record).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

export function entriesToRecord(
  entries: DetailEntry[] | undefined,
): Record<string, string | number | boolean> {
  if (!entries) return {};

  const result: Record<string, string | number | boolean> = {};
  for (const entry of entries) {
    if (!entry.key) continue;
    const v = String(entry.value);
    if (v === "true") {
      result[entry.key] = true;
      continue;
    }
    if (v === "false") {
      result[entry.key] = false;
      continue;
    }
    const num = Number(v);
    if (v !== "" && !Number.isNaN(num)) {
      result[entry.key] = num;
      continue;
    }
    result[entry.key] = v;
  }
  return result;
}
