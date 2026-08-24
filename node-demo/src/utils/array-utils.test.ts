import { describe, expect, it } from 'vitest';
import { findItem, findLastEven } from './array-utils.js';

describe('findItem', () => {
  it('returns the first matching item', () => {
    expect(findItem([1, 2, 2, 3], 2)).toBe(2);
  });

  it('returns undefined when the target is missing', () => {
    expect(findItem(['red', 'blue'], 'green')).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(findItem([], 'blue')).toBeUndefined();
  });

  it('uses strict equality for object targets', () => {
    const target = { id: 1 };

    expect(findItem([{ id: 1 }, target], target)).toBe(target);
  });
});

describe('findLastEven', () => {
  it('should return the last even number in the array', () => {
    const numbers = [1, 2, 3, 4, 5, 6];

    const result = findLastEven(numbers);

    expect(result).toBe(6);
  });

  it('should return undefined when the array has no even numbers', () => {
    const numbers = [1, 3, 5];

    const result = findLastEven(numbers);

    expect(result).toBeUndefined();
  });

  it('should return undefined for an empty array', () => {
    const numbers: number[] = [];

    const result = findLastEven(numbers);

    expect(result).toBeUndefined();
  });
});