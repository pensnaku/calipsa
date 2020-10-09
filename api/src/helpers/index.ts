export function ensureVariableExists<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}
