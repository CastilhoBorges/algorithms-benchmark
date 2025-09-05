/* Given a string s, find the length of the longest substring without duplicate characters. */

export function lengthOfLongestSubstring(s: string): number {
    const charSet: Set<string> = new Set();

    let maxLength = 0;
    let leftPointer = 0;

    for (let rightPointer = 0; rightPointer < s.length; rightPointer++) {
        while (charSet.has(s[rightPointer])) {
            charSet.delete(s[leftPointer]);
            leftPointer++
        }

        charSet.add(s[rightPointer]);

        maxLength = Math.max(maxLength, charSet.size);
    }

    return maxLength;
}
