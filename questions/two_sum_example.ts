// Задача: найти два числа в массиве, сумма которых равна target
// Пример: [2, 7, 11, 15], target = 9 => [0, 1] (2 + 7 = 9)

// Решение 1: Наивный подход O(n²)
function twoSumNaive(nums: number[], target: number): [number, number] | null {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}

// Решение 2: Оптимизированный подход с Hash Map O(n)
function twoSumOptimized(
  nums: number[],
  target: number
): [number, number] | null {
  const numMap = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (numMap.has(complement)) {
      return [numMap.get(complement)!, i];
    }

    numMap.set(nums[i], i);
  }

  return null;
}

// Пример использования
const numbers = [2, 7, 11, 15];
const target = 9;

console.log("Наивное решение O(n²):", twoSumNaive(numbers, target));
console.log("Оптимизированное решение O(n):", twoSumOptimized(numbers, target));
