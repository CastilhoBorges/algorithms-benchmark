import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import * as path from 'path';
import * as fs from 'fs';

type AlgoFn<T> = (input: T) => any;
type InputGenerator<T> = (n: number) => T;

function measureTimeAndMemory<T>(fn: () => T): {
  result: T;
  timeMs: number;
  memoryMb: number;
} {
  global.gc?.();
  const startMem = process.memoryUsage().heapUsed;
  const start = process.hrtime.bigint();

  const result = fn();

  const end = process.hrtime.bigint();
  const endMem = process.memoryUsage().heapUsed;

  const timeMs = Number(end - start) / 1_000_000;
  const memoryMb = (endMem - startMem) / 1024 / 1024;

  return { result, timeMs, memoryMb };
}

export async function benchmark<T>(
  name: string,
  fn: AlgoFn<T>,
  generator: InputGenerator<T>,
  sizes: number[],
  outputFileName: string = 'benchmark.png'
) {
  console.log(`\n⏱️ Benchmark: ${name}`);
  console.log('-----------------------------------');

  const results = sizes.map((n) => {
    const input = generator(n);
    const { timeMs, memoryMb } = measureTimeAndMemory(() => fn(input));
    return { n, timeMs, memoryMb };
  });

  console.table(results);

  const timeRatios: number[] = [];
  const memRatios: number[] = [];
  for (let i = 1; i < results.length; i++) {
    timeRatios.push(results[i].timeMs / results[i - 1].timeMs);
    memRatios.push(
      Math.max(results[i].memoryMb / (results[i - 1].memoryMb || 0.0001), 0)
    );
  }

  const avgTimeRatio =
    timeRatios.reduce((a, b) => a + b, 0) / timeRatios.length;
  const avgMemRatio = memRatios.reduce((a, b) => a + b, 0) / memRatios.length;

  console.log('\n🔎 Estimated Complexity:');
  if (avgTimeRatio < 1.5) console.log('⏱ Time: O(1) ~ constant');
  else if (avgTimeRatio < 3) console.log('⏱ Time: O(n) ~ linear');
  else if (avgTimeRatio < 6) console.log('⏱ Time: O(n log n) ~ nearly-linear');
  else console.log('⏱ Time: O(n^2) or worse');

  if (avgMemRatio < 1.5) console.log('💾 Space: O(1) ~ constant');
  else if (avgMemRatio < 3) console.log('💾 Space: O(n) ~ linear');
  else if (avgMemRatio < 6) console.log('💾 Space: O(n log n) ~ nearly-linear');
  else console.log('💾 Space: O(n^2) or worse');

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

  const projectRoot = process.cwd();
  const analyticsDir = path.join(projectRoot, 'analytics');
  if (!fs.existsSync(analyticsDir)) fs.mkdirSync(analyticsDir);
  const outputPath = path.join(analyticsDir, outputFileName);

  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(outputPath, buffer);
  console.log(`\n📊 Chart generated at: ${outputPath}`);
}
