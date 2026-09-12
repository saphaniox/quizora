import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Exercise the actual client against Fastify, with database access isolated in memory.
process.env.NODE_ENV = "test";
const { createApp } = await import("../../../server/dist/index.js");
const { pool } = await import("../../../server/dist/db.js");
const users = new Map();
const sessions = new Map();
pool.query = async (sql, values) => {
  if (sql.startsWith("INSERT INTO users")) {
    const [id, email, phone_e164, password_hash, display_name] = values;
    if ([...users.values()].some(u => email ? u.email === email : u.phone_e164 === phone_e164)) {
      throw Object.assign(new Error("Duplicate"), { code: "23505" });
    }
    const user = { id, email, phone_e164, password_hash, display_name, role: "user" };
    users.set(id, user);
    return { rows: [user] };
  }
  if (sql.startsWith("INSERT INTO sessions")) {
    sessions.set(values[0], values[1]);
    return { rows: [] };
  }
  if (sql.startsWith("SELECT id, email")) {
    return { rows: [...users.values()].filter(u => (values[0] && u.email === values[0]) || (values[1] && u.phone_e164 === values[1])) };
  }
  if (sql.startsWith("SELECT u.id")) {
    const user = users.get(sessions.get(values[0]));
    return { rows: user ? [user] : [] };
  }
  if (sql.startsWith("DELETE FROM sessions")) {
    sessions.delete(values[0]);
    return { rows: [] };
  }
  throw new Error(`Unexpected database query: ${sql}`);
};
const app = await createApp();
const storage = new Map();
globalThis.window = { localStorage: {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
} };
let calls = [];
let failure = false;
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  if (failure) throw new TypeError("Network unavailable");
  assert.ok(url.startsWith("/api/"));
  const result = await app.inject({
    method: init.method ?? "GET",
    url: url.slice(4),
    headers: Object.fromEntries(init.headers),
    ...(init.body ? { payload: init.body } : {}),
  });
  return new Response(result.body, { status: result.statusCode });
};
let source = await readFile(new URL("./api.ts", import.meta.url), "utf8");
source = source.replace('import { Capacitor } from "@capacitor/core";', 'const Capacitor = { isNativePlatform: () => false };');
source = source.replace(/import \{ loadApiCache[^;]+;/, 'const loadApiCache = () => null; const saveApiCache = () => {};');
source = source.replaceAll("import.meta.env", '({})');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const api = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("email and phone registration, sign in, current user, and logout", async () => {
  for (const contact of [{ email: "test@example.com" }, { phoneE164: "+256700000001" }]) {
    const payload = { ...contact, displayName: "Test User", password: "test-password-123" };
    const registered = await api.registerAccount(payload);
    assert.equal((await api.getCurrentUser()).user.id, registered.user.id);
    const before = calls.length;
    await assert.rejects(api.registerAccount(payload), /already registered/);
    assert.equal(calls.length - before, 1, "mutations must not be retried");
    await api.logoutAccount();
    assert.equal(calls.at(-1).init.headers.has("content-type"), false);
    assert.equal((await api.getCurrentUser()).user, null);
    await assert.rejects(api.loginAccount({ identifier: contact.email ?? contact.phoneE164, password: "wrong-password" }), /Invalid/);
    const signedIn = await api.loginAccount({ identifier: contact.email ?? contact.phoneE164, password: payload.password });
    assert.equal(signedIn.user.id, registered.user.id);
    assert.equal((await api.getCurrentUser()).user.id, registered.user.id);
    failure = true;
    await assert.rejects(api.logoutAccount(), /Network unavailable/);
    assert.ok(storage.get("quitech-session-token"), "failed logout retains session for retry");
    failure = false;
    await api.logoutAccount();
    assert.equal(storage.has("quitech-session-token"), false);
  }
});

test("bodyless DELETE reaches authorization instead of JSON parser failure", async () => {
  await assert.rejects(api.deleteAccountProgress("example"), /Sign in to clear saved progress/);
  assert.equal(calls.at(-1).init.headers.has("content-type"), false);
});

test("Fastify reproduces original empty JSON logout failure", async () => {
  const result = await app.inject({ method: "POST", url: "/auth/logout", headers: { "content-type": "application/json" } });
  assert.equal(result.statusCode, 400);
  assert.equal(result.json().code, "FST_ERR_CTP_EMPTY_JSON_BODY");
});

test("web proxy forwards credentials, JSON, empty requests, and cookies", async () => {
  const proxySource = (await readFile(new URL("./api-proxy.server.ts", import.meta.url), "utf8")).replaceAll("import.meta.env", "({})");
  const proxyCode = ts.transpileModule(proxySource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { proxyApiRequest } = await import(`data:text/javascript;base64,${Buffer.from(proxyCode).toString("base64")}`);
  const originalFetch = globalThis.fetch;
  const originalBase = process.env.SERVER_API_URL;
  process.env.SERVER_API_URL = "http://localhost:3001";
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(new URL(url).pathname, "/auth/login");
      assert.equal(init.headers.get("authorization"), "Bearer test-token");
      assert.deepEqual(JSON.parse(new TextDecoder().decode(init.body)), { identifier: "test@example.com", password: "example-password" });
      return new Response(JSON.stringify({ user: { id: "test" } }), { headers: { "set-cookie": "session=test; Domain=api.example.com; HttpOnly; Path=/" } });
    };
    const response = await proxyApiRequest(new Request("https://example.com/api/auth/login", {
      method: "POST", headers: { "content-type": "application/json", authorization: "Bearer test-token" },
      body: JSON.stringify({ identifier: "test@example.com", password: "example-password" }),
    }), "/auth/login");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("set-cookie"), "session=test; HttpOnly; Path=/");
    globalThis.fetch = async (url, init) => {
      assert.equal(init.headers.has("content-type"), false);
      assert.equal(init.body, undefined);
      return new Response('{"ok":true}');
    };
    assert.equal((await proxyApiRequest(new Request("https://example.com/api/auth/logout", { method: "POST", headers: { "content-type": "application/json" } }), "/auth/logout")).status, 200);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalBase === undefined) delete process.env.SERVER_API_URL;
    else process.env.SERVER_API_URL = originalBase;
  }
});

test.after(async () => { await app.close(); await pool.end(); });

