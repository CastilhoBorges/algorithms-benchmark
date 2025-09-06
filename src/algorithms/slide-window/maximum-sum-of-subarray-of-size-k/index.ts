/* Given an array and a number k, find the maximum sum of any continuous subarray of size k */

export function maximumSumOfSubarrayOfSizeK(
  arr: number[],
  k: number
): number | null {
  if (k > arr.length || !arr.length) {
    return null;
  }

  let windowSum = 0;
  let leftPointer = 0;

  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[leftPointer] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
    leftPointer++;
  }

  return maxSum;
}
