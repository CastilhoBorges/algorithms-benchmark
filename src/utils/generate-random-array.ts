export function generateRandomArray(n: number): { arr: number[]; k: number } {
  const arr = Array.from(
    { length: n },
    () => Math.floor(Math.random() * 100) - 50
  );
  const k = Math.max(1, Math.floor(n * 0.1));
  return { arr, k };
}
