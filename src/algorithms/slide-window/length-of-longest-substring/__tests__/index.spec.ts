import {
  lengthOfLongestSubstring,
  lengthOfLongestSubstringBruteForce,
} from '..';
import { benchmark } from '../../../../utils/benchmark';
import { generateString } from '../../../../utils/generate-string';

async function runBenchmark() {
  await benchmark(
    'Longest Substring',
    lengthOfLongestSubstring,
    generateString,
    [1e3, 5e3, 1e4, 5e4, 1e5],
    'lengthOfLongestSubstring.png'
  );

  await benchmark(
    'Longest Substring Brute Force',
    lengthOfLongestSubstringBruteForce,
    generateString,
    [100, 1000, 10000],
    'lengthOfLongestSubstringBruteForce.png'
  );
}

runBenchmark().catch(console.error);
