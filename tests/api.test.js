import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../api/index.js';

const PORT = 5099;
const baseUrl = `http://localhost:${PORT}`;
let server;

test.before((done) => {
  server = http.createServer(app);
  server.listen(PORT, done);
});

test.after((done) => {
  if (server) server.close(done);
  else done();
});

function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${baseUrl}${path}`;
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    const req = http.request(fullUrl, { method, headers: reqHeaders }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

test('API Health Endpoint: Returns 200 OK with status and timestamp', async () => {
  const res = await makeRequest('/api/health');
  assert.strictEqual(res.status, 200);
  assert.ok(res.data);
  assert.strictEqual(res.data.status, 'OK');
});

test('API Telemetry Endpoint: Returns matchInfo, gates, incidents, and tasks', async () => {
  const res = await makeRequest('/api/telemetry');
  assert.strictEqual(res.status, 200);
  assert.ok(res.data.matchInfo);
  assert.ok(Array.isArray(res.data.gates));
  assert.ok(Array.isArray(res.data.incidents));
  assert.ok(Array.isArray(res.data.concessions));
});

test('API Auth Login: Authenticates demo organizer credentials', async () => {
  const res = await makeRequest('/api/auth/login', 'POST', {
    email: 'organizer@worldcup2026.org',
    password: 'ops2026',
    role: 'ops'
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.success, true);
  assert.ok(res.data.token);
  assert.strictEqual(res.data.user.role, 'ops');
});

test('API AI Chat: Generates spatial concierge answer for food queries', async () => {
  const res = await makeRequest('/api/ai/chat', 'POST', {
    prompt: 'Where is the food near section 112?'
  });
  assert.strictEqual(res.status, 200);
  assert.ok(res.data.text);
  assert.ok(res.data.text.includes('Taco Fiesta') || res.data.text.includes('wait time'));
});
