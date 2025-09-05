/* Given a string s, find the length of the longest substring without duplicate characters. */

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
