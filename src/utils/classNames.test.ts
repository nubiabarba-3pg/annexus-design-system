import { describe, it, expect } from 'vitest';
import { classNames } from './classNames';

describe('classNames', () => {
  it('should join truthy strings when several are given', () => {
    expect(classNames('a', 'b')).toBe('a b');
  });

  it('should ignore falsy values when mixed with strings', () => {
    expect(classNames('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('should omit the class when a conditional expression is false', () => {
    const active = false;
    expect(classNames('btn', active && 'btn--active')).toBe('btn');
  });

  it('should include the class when a conditional expression is true', () => {
    const active = true;
    expect(classNames('btn', active && 'btn--active')).toBe('btn btn--active');
  });

  it('should flatten arrays when given an array of classes', () => {
    expect(classNames(['a', false, 'b'], 'c')).toBe('a b c');
  });

  it('should return a single class unchanged', () => {
    expect(classNames('only')).toBe('only');
  });

  it('should return an empty string when all values are falsy', () => {
    expect(classNames(false, undefined)).toBe('');
  });
});
