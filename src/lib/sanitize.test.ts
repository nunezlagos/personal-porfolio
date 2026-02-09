import { describe, it, expect } from 'vitest';

export function sanitizeJsonString(s: string): string {
  return s
    .replace(/\u2028/g, '')
    .replace(/\u2029/g, '')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

export function isValidSectionKey(key: string): boolean {
  return ['head', 'home', 'about', 'projects', 'certifications', 'experiences'].includes(key);
}

describe('sanitize', () => {
  it('sanitizeJsonString escapes angle brackets', () => {
    expect(sanitizeJsonString('<script>')).toBe('\\u003cscript\\u003e');
    expect(sanitizeJsonString('foo')).toBe('foo');
  });

  it('isValidSectionKey accepts only known keys', () => {
    expect(isValidSectionKey('head')).toBe(true);
    expect(isValidSectionKey('projects')).toBe(true);
    expect(isValidSectionKey('')).toBe(false);
    expect(isValidSectionKey('../../etc/passwd')).toBe(false);
    expect(isValidSectionKey('head; DROP TABLE sections')).toBe(false);
  });
});
