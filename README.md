# Algorithms Benchmark Repository

This repository is designed for training algorithms (Leetcode-style) and running benchmarks to estimate **time and space complexity** with charts and Big O approximations.

---

## Features

- Measure **execution time** and **memory usage** for your algorithms.
- Estimate **time and space complexity** automatically.
- Generate **charts** showing time and memory trends.
- Simple setup with **TypeScript + Node.js**.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd algoritmos
npm install
```

## Scripts

The package.json comes with these useful scripts:

```json
"scripts": {
  "build": "rm -rf dist && tsc",
  "test:ts": "node --expose-gc -r ts-node/register --",
  "test:js": "npm run build && node --expose-gc --"
}
```

- `npm run build` → Compile TypeScript to dist.
- `npm run test:ts <file>` → Run a TypeScript benchmark/test file.
- `npm run test:js <file>` → Run a compiled JS file with memory profiling.

**Note:** `--expose-gc` is required to accurately measure memory usage.

## Benchmark Utility

### Importing

```typescript
import { benchmark } from './utils/benchmark';
```

### Usage Example

```typescript
import { benchmark } from './utils/benchmark';
import { generateString } from './utils/generate-string';
import { lengthOfLongestSubstringBruteForce } from './algorithms/slide-window/length/brute-force';

(async () => {
  await benchmark(
    'Longest Substring Brute Force',
    lengthOfLongestSubstringBruteForce,
    generateString,
    [100, 1000, 10000]
  );
})();
```

### benchmark Parameters

- `name: string` → Name of the benchmark.
- `fn: (input: T) => any` → The algorithm function to test.
- `generator: (n: number) => T` → Function to generate input of size n.
- `sizes: number[]` → Array of input sizes to test.
- `outputFileName?: string` → Optional chart filename (benchmark.png by default).

### Chart Output

- Charts are automatically generated in the `analytics/` folder at the project root.
- Default filename: `benchmark.png`.
- Shows time (ms) and memory (MB) for each input size.

## Memory and Complexity Analysis

- Uses Node.js `process.memoryUsage()` for memory profiling.
- Estimates Big O for time and space based on growth ratios between input sizes.
- Time and memory complexities are printed in the console along with the chart.

## Generate Your Own Benchmarks

1. Implement your algorithm in `src/algorithms/...`.
2. Create a test file in the same folder or `tests/`.
3. Use `benchmark` with your algorithm and an input generator.
4. Run with:

```bash
npm run test:ts src/algorithms/.../your-test.ts
```

5. Charts will be saved automatically in `analytics/`.

## Example Output

```
⏱️ Benchmark: Longest Substring Brute Force
-----------------------------------
┌─────────┬─────┬─────────┬───────────┐
│ (index) │ n   │ timeMs  │ memoryMb  │
├─────────┼─────┼─────────┼───────────┤
│    0    │ 100 │ 0.12    │ 0.03      │
│    1    │ 1000│ 15.3    │ 1.2       │
│    2    │10000│ 1200.0  │ 12.0      │
└─────────┴─────┴─────────┴───────────┘

🔎 Estimated Complexity:
⏱ Time: O(n^2) or worse
💾 Space: O(n) ~ linear

📊 Chart generated at: analytics/benchmark.png
```

## Requirements

- Node.js 18+ (or any version with `--expose-gc`)
- TypeScript 5+
- Dependencies:

```bash
npm install chart.js chartjs-node-canvas
npm install -D typescript ts-node @types/node
```

## License

MIT License

---

This README is fully in **English**, explains how to use your benchmark utility, generate charts, and run tests in TypeScript or JavaScript.

If you want, I can also **create a shorter "quickstart" version** with copy-paste example for beginners. Do you want me to do that?
