export function cleanObject<T>(obj: T): Partial<T> | undefined {
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(cleanObject)
      .filter((item) => item !== undefined && item !== null);

    return cleanedArray.length > 0 ? (cleanedArray as unknown as T) : undefined;
  }

  if (typeof obj === "object" && obj !== null) {
    const cleaned: any = {};

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const value = cleanObject((obj as any)[key]);

      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "string" || value !== "") &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        cleaned[key] = value;
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  return obj;
}
