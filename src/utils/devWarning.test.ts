import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { devWarning } from './devWarning';

describe('devWarning', () => {
  const originalEnv = process.env.NODE_ENV;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    warnSpy.mockRestore();
  });

  it('should warn once with the component prefix when the condition is false in development', () => {
    process.env.NODE_ENV = 'development';
    devWarning(false, 'Button', 'test msg');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('[Button] test msg');
  });

  it('should not warn when the condition is true', () => {
    process.env.NODE_ENV = 'development';
    devWarning(true, 'Button', 'test msg');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should not warn when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    devWarning(false, 'Button', 'test msg');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
