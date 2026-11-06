import assert from "node:assert/strict";
import test from "node:test";
import { readSupabaseJson } from "../src/lib/supabase-read.ts";

test("a transient future-issued token recovers without changing GET semantics", async () => {
  const delays = [];
  const requests = [];
  const responses = [Response.json({ code: "PGRST303", message: "JWT issued at future" }, { status: 401 }), Response.json([{ paused: false }])];
  const result = await readSupabaseJson("https://database.example.test/read", "synthetic-key", {
    fetcher: async (...args) => { requests.push(args); return responses.shift(); },
    wait: async delay => { delays.push(delay); },
  });
  assert.deepEqual(result, [{ paused: false }]);
  assert.deepEqual(delays, [500]);
  assert.equal(requests.length, 2);
  for (const [, request] of requests) {
    assert.equal(request.method, "GET");
    assert.equal(request.cache, "no-store");
    assert.equal(request.headers.apikey, "synthetic-key");
  }
});

test("invalid credentials and permission denial fail immediately without exposing response data", async () => {
  for (const [status, body] of [[401, { code: "PGRST301", message: "private diagnostic" }], [401, { code: "PGRST303", message: "JWT expired" }], [403, { message: "private diagnostic" }]]) {
    let count = 0;
    await assert.rejects(readSupabaseJson("https://database.example.test/read", "synthetic-key", {
      fetcher: async () => { count++; return Response.json(body, { status }); },
      wait: async () => { assert.fail("Authorization failures must not retry"); },
    }), error => error.message === `Database read failed (${status})`);
    assert.equal(count, 1);
  }
});

test("temporary service failure is bounded and remains fail closed", async () => {
  let count = 0;
  const delays = [];
  await assert.rejects(readSupabaseJson("https://database.example.test/read", "synthetic-key", {
    fetcher: async () => { count++; return new Response("Service unavailable", { status: 503 }); },
    wait: async delay => { delays.push(delay); },
  }), /Database read failed \(503\)/);
  assert.equal(count, 3);
  assert.deepEqual(delays, [500, 1500]);
});
