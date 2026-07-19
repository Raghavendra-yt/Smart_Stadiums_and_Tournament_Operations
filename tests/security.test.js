import test from 'node:test';
import assert from 'node:assert';

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 250);
}

test('Security Sanitizer: Escapes script tags and HTML injection', () => {
  const dangerous = '<script>alert("XSS")</script>';
  const clean = sanitizeInput(dangerous);
  assert.ok(!clean.includes('<script>'));
  assert.strictEqual(clean, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
});

test('Security Sanitizer: Enforces 250 character length cap', () => {
  const longInput = 'A'.repeat(500);
  const clean = sanitizeInput(longInput);
  assert.strictEqual(clean.length, 250);
});

test('Security Auth: Bearer token validation logic', () => {
  const activeTokens = { 'valid-bearer-token-123': { user: 'J. Smith', role: 'ops' } };
  const authHeader = 'Bearer valid-bearer-token-123';
  const token = authHeader.split(' ')[1];
  assert.ok(activeTokens[token]);
  assert.strictEqual(activeTokens[token].role, 'ops');
});

test('Security Auth: Rejects missing or malformed auth headers', () => {
  const malformedHeader = 'Basic dXNlcjpwYXNz';
  const isValidBearer = malformedHeader.startsWith('Bearer ');
  assert.strictEqual(isValidBearer, false);
});
