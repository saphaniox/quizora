import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "test";
const { createApp } = await import("../dist/index.js");
process.env.NODE_ENV = "production";

const app = await createApp();

test("production CORS allows the deployed web app and Capacitor origins", async () => {
  for (const origin of [
    "https://quitech.online",
    "https://www.quitech.online",
    "capacitor://localhost",
  ]) {
    const response = await app.inject({
      method: "OPTIONS",
      url: "/health",
      headers: {
        origin,
        "access-control-request-method": "GET",
      },
    });
    assert.equal(response.headers["access-control-allow-origin"], origin);
  }
});

test("production CORS rejects null and lookalike origins", async () => {
  for (const origin of [
    "null",
    "https://quitech.online.attacker.invalid",
    "http://localhost.attacker.invalid",
  ]) {
    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin },
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers["access-control-allow-origin"], undefined);
  }
});

test.after(async () => {
  await app.close();
});
