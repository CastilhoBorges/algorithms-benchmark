import { maximumSumOfSubarrayOfSizeK } from '..';
import { benchmark } from '../../../../utils/benchmark';
import { generateRandomArray } from '../../../../utils/generate-random-array';

function testMaximumSum(input: { arr: number[]; k: number }): number | null {
  return maximumSumOfSubarrayOfSizeK(input.arr, input.k);
}

async function runBenchmark() {
  await benchmark(
    'Maximum Sum of Subarray of Size K',
    testMaximumSum,
    generateRandomArray,
    [10, 100, 1000, 10000, 100000, 1000000, 10000000],
    'maximum-sum-subarray-benchmark.png'
  );
}

runBenchmark().catch(console.error);
