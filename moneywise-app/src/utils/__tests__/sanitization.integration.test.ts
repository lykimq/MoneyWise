import {
  sanitizeString,
  sanitizeForUrl,
  sanitizeNumber,
  sanitizeObject,
} from '../sanitization';

/**
 * Integration tests for sanitization functions to prevent XSS attacks.
 */
describe('sanitizeString', () => {
  it('should handle null and undefined inputs', async () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
  });

  it('should remove script tags completely', () => {
    const input = '<script>alert("test")</script>';
    expect(sanitizeString(input)).toBe('');

    const complexInput =
      'Hello <script type="text/javascript">console.log("world")</script>!';
    expect(sanitizeString(complexInput)).toBe('Hello !');
  });

  it('should remove iframe tags completely', () => {
    const input = 'Before <iframe src="http://malicious.com"></iframe> After';
    expect(sanitizeString(input)).toBe('Before  After');
  });

  it('should remove event handlers and their values', () => {
    const input = '<div onclick="maliciousFunction()">Click me</div>';
    expect(sanitizeString(input)).toBe('Click me');
  });

  it('should remove various event handlers', () => {
    const input =
      '<div onload="evil()" onerror="bad()" onmouseover="attack()">Content</div>';
    expect(sanitizeString(input)).toBe('Content');

    const input2 = '<img onload="malicious()" onerror="hack()" src="test.jpg">';
    expect(sanitizeString(input2)).toBe('');
  });

  it('should handle nested HTML and multiple sanitization needs', () => {
    const input = `
            <div onclick="alert('test')">
                <script>console.log("nested")</script>
                <iframe src="evil.com"></iframe>
                <p>Safe content</p>
            </div>
        `;
    const result = sanitizeString(input);
    expect(result.includes('Safe content')).toBe(true);
    expect(result.includes('<script>')).toBe(false);
    expect(result.includes('<iframe')).toBe(false);
    expect(result.includes('<div')).toBe(false);
  });

  it('should remove javascript: protocol', () => {
    const input = 'javascript:alert(1)';
    expect(sanitizeString(input)).toBe('alert(1)');
  });
});

// Tests URL sanitization to prevent path traversal and protocol injection
describe('sanitizeForUrl', () => {
  it('should handle null and undefined inputs', () => {
    expect(sanitizeForUrl(null)).toBe('');
    expect(sanitizeForUrl(undefined)).toBe('');
  });

  it('should prevent path traversal attacks', () => {
    expect(sanitizeForUrl('../../../etc/passwd')).toBe('//etc/passwd');
    expect(sanitizeForUrl('safe/../../malicious')).toBe('safe/malicious');
  });

  it('should handle encoded malicious content', () => {
    const encoded = encodeURIComponent('javascript:alert(1)');
    expect(sanitizeForUrl(encoded)).not.toContain('javascript:');
  });

  it('should preserve valid URL components', () => {
    const validUrl = 'https://api.example.com/path?param=value&other=123';
    expect(sanitizeForUrl(validUrl)).toBe(validUrl);
  });

  it('should normalize multiple slashes', () => {
    expect(sanitizeForUrl('https://example.com////path')).toBe(
      'https://example.com/path'
    );
    expect(sanitizeForUrl('path///to///resource')).toBe('path/to/resource');
  });

  it('should remove unsafe characters while keeping URL-safe ones', () => {
    const input = 'https://api.example.com/<script>alert(1)</script>/path';
    expect(sanitizeForUrl(input)).toBe(
      'https://api.example.com/scriptalert1/script/path'
    );
  });
});

// Tests numeric sanitization for safe mathematical operations
describe('sanitizeNumber', () => {
  it('should handle null and undefined inputs', () => {
    expect(sanitizeNumber(null)).toBe(0);
    expect(sanitizeNumber(undefined)).toBe(0);
  });

  it('should handle valid number inputs', () => {
    expect(sanitizeNumber(123)).toBe(123);
    expect(sanitizeNumber(-456)).toBe(-456);
    expect(sanitizeNumber(123.456)).toBe(123.456);
  });

  it('should handle valid numeric strings', () => {
    expect(sanitizeNumber('123')).toBe(123);
    expect(sanitizeNumber('-456')).toBe(-456);
    expect(sanitizeNumber('123.456')).toBe(123.456);
  });

  it('should handle invalid numeric inputs', () => {
    expect(sanitizeNumber('abc')).toBe(0);
    expect(sanitizeNumber('123abc')).toBe(0);
    expect(sanitizeNumber('12.34.56')).toBe(0);
  });

  it('should handle edge cases', () => {
    expect(sanitizeNumber(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER
    );
    expect(sanitizeNumber(Number.MAX_SAFE_INTEGER + 1)).toBe(0);
    expect(sanitizeNumber(Infinity)).toBe(0);
    expect(sanitizeNumber(NaN)).toBe(0);
  });

  it('should handle whitespace in string numbers', () => {
    expect(sanitizeNumber('  123  ')).toBe(123);
    expect(sanitizeNumber('  -456.789  ')).toBe(-456.789);
  });

  it('should handle scientific notation', () => {
    expect(sanitizeNumber('1e5')).toBe(100000);
    expect(sanitizeNumber('1.5e-3')).toBe(0.0015);
    expect(sanitizeNumber('2E+4')).toBe(20000);
    expect(sanitizeNumber('-3.2e-2')).toBe(-0.032);
  });
});

// Tests recursive object sanitization for complex data structures
describe('sanitizeObject', () => {
  it('should handle null and undefined inputs', () => {
    expect(sanitizeObject(null)).toBeNull();
    expect(sanitizeObject(undefined)).toBeNull();
  });

  it('should sanitize nested objects', () => {
    const input = {
      name: '<script>alert("name")</script>John',
      age: '25',
      profile: {
        bio: '<div onclick="evil()">Bio text</div>',
        website: 'javascript:alert(1)',
        score: '123.456',
      },
    };

    const expected = {
      name: 'John',
      age: 25,
      profile: {
        bio: 'Bio text',
        website: 'alert(1)',
        score: 123.456,
      },
    };

    expect(sanitizeObject(input)).toEqual(expected);
  });

  it('should handle arrays', () => {
    const input = [
      '<script>alert(1)</script>',
      123,
      { text: '<div>Hello</div>' },
    ];

    const expected = ['', 123, { text: 'Hello' }];

    expect(sanitizeObject(input)).toEqual(expected);
  });

  it('should sanitize object keys', () => {
    const input = {
      '<script>key</script>': 'value',
      normal_key: '<div>value</div>',
    };

    const expected = {
      key: 'value',
      normal_key: 'value',
    };

    expect(sanitizeObject(input)).toEqual(expected);
  });

  it('should handle mixed types correctly', () => {
    const input = {
      string: 'Hello <script>World</script>',
      number: '123.456',
      array: ['<div>Item</div>', 789],
      nested: {
        text: '<p onclick="evil()">Text</p>',
        score: '456',
      },
    };

    const expected = {
      string: 'Hello',
      number: 123.456,
      array: ['Item', 789],
      nested: {
        text: 'Text',
        score: 456,
      },
    };

    expect(sanitizeObject(input)).toEqual(expected);
  });
});
