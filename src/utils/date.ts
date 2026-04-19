export const toApiDate = (value?: string | null) => {
  if (!value) return undefined;
  return new Date(value + "T00:00:00.000Z");
};

export const fromApiDate = (value?: string | Date | null) => {
  if (!value) return "";
  return typeof value === "string"
    ? value.slice(0, 10)
    : value.toISOString().slice(0, 10);
};