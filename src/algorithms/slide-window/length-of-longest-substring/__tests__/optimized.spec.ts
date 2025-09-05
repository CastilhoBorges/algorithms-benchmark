import { lengthOfLongestSubstring } from '../optimized';
import { benchmark } from '../../../../config/benchmark';
import { generateString } from '../../../../utils/generate-string';

benchmark(
  'Longest Substring',
  lengthOfLongestSubstring,
  generateString,
  [1e3, 5e3, 1e4, 5e4, 1e5]
);
