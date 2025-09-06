/* Given a string s, find the length of the longest substring without duplicate characters. */

export function lengthOfLongestSubstring(s: string): number {
  const charSet: Set<string> = new Set();

  let maxLength = 0;
  let leftPointer = 0;

  for (let rightPointer = 0; rightPointer < s.length; rightPointer++) {
    while (charSet.has(s[rightPointer])) {
      charSet.delete(s[leftPointer]);
      leftPointer++;
    }

    charSet.add(s[rightPointer]);

    maxLength = Math.max(maxLength, charSet.size);
  }

  return maxLength;
}

// Brute Force
export function lengthOfLongestSubstringBruteForce(s: string): number {
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const substring = s.slice(i, j + 1);

      if (allUnique(substring)) {
        maxLength = Math.max(maxLength, substring.length);
      }
    }
  }

  return maxLength;
}

function allUnique(substring: string): boolean {
  const seen = new Set<string>();
  for (const char of substring) {
    if (seen.has(char)) {
      return false;
    }
    seen.add(char);
  }
  return true;
}
