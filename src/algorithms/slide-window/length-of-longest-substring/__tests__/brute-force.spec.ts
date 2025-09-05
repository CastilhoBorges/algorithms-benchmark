import { benchmark } from '../../../../config/benchmark';
import { generateString } from '../../../../utils/generate-string';
import { lengthOfLongestSubstringBruteForce } from '../brute-force';

benchmark(
  'Longest Substring Brute Force',
  lengthOfLongestSubstringBruteForce,
  generateString,
  [100, 1000, 10000]
);
