import { benchmark } from '../../../../utils/benchmark';
import { generateString } from '../../../../utils/generate-string';
import { lengthOfLongestSubstringBruteForce } from '../brute-force';

(async () => {
  await benchmark(
    'Longest Substring Brute Force',
    lengthOfLongestSubstringBruteForce,
    generateString,
    [100, 1000, 10000],
    "lengthOfLongestSubstringBruteForce.png"
  );
})();
