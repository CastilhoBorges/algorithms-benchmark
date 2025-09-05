/**
 * @fileoverview Benchmark utility for measuring algorithm performance
 * @description This module provides tools to measure execution time and memory usage
 * of algorithms, estimate their Big O complexity, and generate performance charts.
 *
 * @requires chart.js
 * @requires chartjs-node-canvas
 * @requires Node.js with --expose-gc flag for accurate memory measurements
 *
 * @author Your Name
 * @version 1.0.0
 */

import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Generic type for algorithm functions that take an input and return any result
 * @template T - The input type for the algorithm
 */
type AlgoFn<T> = (input: T) => any;

/**
 * Type for functions that generate test inputs of a given size
 * @template T - The type of input to generate
 */
type InputGenerator<T> = (n: number) => T;

/**
 * Result object containing execution metrics
 */
interface MeasurementResult<T> {
  /** The result returned by the measured function */
  result: T;
  /** Execution time in milliseconds */
  timeMs: number;
  /** Memory usage in megabytes */
  memoryMb: number;
}

/**
 * Benchmark result for a specific input size
 */
interface BenchmarkPoint {
  /** Input size */
  n: number;
  /** Execution time in milliseconds */
  timeMs: number;
  /** Memory usage in megabytes */
  memoryMb: number;
}

/**
 * Measures execution time and memory usage of a function
 *
 * @template T - Return type of the function being measured
 * @param fn - Function to measure (should be a closure containing the algorithm call)
 * @returns Object containing the result, execution time, and memory usage
 *
 * @example
 * ```typescript
 * const { result, timeMs, memoryMb } = measureTimeAndMemory(() => {
 *   return myAlgorithm(input);
 * });
 * ```
 *
 * @remarks
 * - Requires Node.js to be run with --expose-gc flag for accurate memory measurements
 * - Calls global.gc() before measurement to clean up memory
 * - Uses process.hrtime.bigint() for high-resolution time measurement
 * - Memory usage is calculated as the difference in heap usage before/after execution
 */
function measureTimeAndMemory<T>(fn: () => T): MeasurementResult<T> {
  // Force garbage collection to get accurate memory baseline
  global.gc?.();

  const startMem = process.memoryUsage().heapUsed;
  const start = process.hrtime.bigint();

  const result = fn();

  const end = process.hrtime.bigint();
  const endMem = process.memoryUsage().heapUsed;

  // Convert nanoseconds to milliseconds
  const timeMs = Number(end - start) / 1_000_000;
  // Convert bytes to megabytes
  const memoryMb = (endMem - startMem) / 1024 / 1024;

  return { result, timeMs, memoryMb };
}

/**
 * Estimates algorithm complexity based on growth ratios between measurements
 *
 * @param ratios - Array of ratios between consecutive measurements
 * @returns Human-readable complexity estimation string
 *
 * @private
 */
function estimateComplexity(ratios: number[]): string {
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

  if (avgRatio < 1.5) return 'O(1) ~ constant';
  if (avgRatio < 3) return 'O(n) ~ linear';
  if (avgRatio < 6) return 'O(n log n) ~ nearly-linear';
  return 'O(n^2) or worse';
}

/**
 * Runs a comprehensive benchmark analysis on an algorithm
 *
 * @template T - The input type for the algorithm being benchmarked
 * @param name - Descriptive name for the benchmark (used in console output and chart title)
 * @param fn - Algorithm function to benchmark
 * @param generator - Function that generates test inputs of specified sizes
 * @param sizes - Array of input sizes to test (e.g., [100, 1000, 10000])
 * @param outputFileName - Optional filename for the generated chart (defaults to 'benchmark.png')
 *
 * @returns Promise that resolves when benchmarking is complete
 *
 * @example
 * ```typescript
 * import { benchmark } from './utils/benchmark';
 * import { bubbleSort } from './algorithms/sorting/bubble-sort';
 * import { generateRandomArray } from './utils/generators';
 *
 * await benchmark(
 *   'Bubble Sort Performance',
 *   bubbleSort,
 *   generateRandomArray,
 *   [100, 500, 1000, 2000],
 *   'bubble-sort-benchmark.png'
 * );
 * ```
 *
 * @remarks
 * Features:
 * - Measures execution time and memory usage for each input size
 * - Estimates Big O complexity for both time and space
 * - Generates a line chart showing performance trends
 * - Outputs results to console in tabular format
 * - Saves chart to analytics/ directory in project root
 *
 * Requirements:
 * - Node.js must be run with --expose-gc flag
 * - Project must have analytics/ directory (created automatically if missing)
 * - Dependencies: chart.js, chartjs-node-canvas
 *
 * Output:
 * - Console: Benchmark name, results table, complexity estimates, chart path
 * - File: PNG chart saved to analytics/ directory
 */
export async function benchmark<T>(
  name: string,
  fn: AlgoFn<T>,
  generator: InputGenerator<T>,
  sizes: number[],
  outputFileName: string = 'benchmark.png'
): Promise<void> {
  console.log(`\n⏱️ Benchmark: ${name}`);
  console.log('-----------------------------------');

  // Run benchmarks for each input size
  const results: BenchmarkPoint[] = sizes.map((n) => {
    const input = generator(n);
    const { timeMs, memoryMb } = measureTimeAndMemory(() => fn(input));
    return { n, timeMs, memoryMb };
  });

  // Display results in console table
  console.table(results);

  // Calculate growth ratios between consecutive measurements
  const timeRatios: number[] = [];
  const memRatios: number[] = [];

  for (let i = 1; i < results.length; i++) {
    timeRatios.push(results[i].timeMs / results[i - 1].timeMs);
    memRatios.push(
      Math.max(results[i].memoryMb / (results[i - 1].memoryMb || 0.0001), 0)
    );
  }

  // Estimate and display complexity
  console.log('\n🔎 Estimated Complexity:');
  console.log(`⏱ Time: ${estimateComplexity(timeRatios)}`);
  console.log(`💾 Space: ${estimateComplexity(memRatios)}`);

  // Generate performance chart
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: results.map((r) => r.n.toString()),
      datasets: [
        {
          label: 'Time (ms)',
          data: results.map((r) => r.timeMs),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Memory (MB)',
          data: results.map((r) => r.memoryMb),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: `Benchmark: ${name}`,
          font: { size: 18 },
        },
        legend: { position: 'top' },
      },
      scales: {
        x: { title: { display: true, text: 'Input Size (n)' } },
        y: { title: { display: true, text: 'Time / Memory' } },
      },
    },
  };

  // Ensure analytics directory exists and save chart
  const projectRoot = process.cwd();
  const analyticsDir = path.join(projectRoot, 'analytics');

  if (!fs.existsSync(analyticsDir)) {
    fs.mkdirSync(analyticsDir);
  }

  const outputPath = path.join(analyticsDir, outputFileName);
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(outputPath, buffer);

  console.log(`\n📊 Chart generated at: ${outputPath}`);
}
