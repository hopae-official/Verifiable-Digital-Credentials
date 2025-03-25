export function isValidClaim<T extends object>(
  value: unknown,
  keys: (keyof T)[],
): value is T {
  return (
    typeof value === 'object' &&
    value !== null &&
    keys.every((key) => key in value)
  );
}
