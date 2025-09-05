import { lengthOfLongestSubstring } from '../optimized';
import { benchmark } from '../../../../utils/benchmark';
import { generateString } from '../../../../utils/generate-string';

(async () => {
  await benchmark(
    'Longest Substring',
    lengthOfLongestSubstring,
    generateString,
    [1e3, 5e3, 1e4, 5e4, 1e5],
    "lengthOfLongestSubstring.png"
  );
})();
