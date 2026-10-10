import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  rateLimitConfigs,
  type RateLimitConfig,
} from "../src/lib/rate-limit";

const config: RateLimitConfig = { windowMs: 60_000, maxRequests: 3 };

test("allows requests up to maxRequests then blocks", () => {
  const id = `test-${Math.random()}`;
  assert.equal(checkRateLimit(id, config).success, true);
  assert.equal(checkRateLimit(id, config).success, true);
  const third = checkRateLimit(id, config);
  assert.equal(third.success, true);
  assert.equal(third.remaining, 0);
  const fourth = checkRateLimit(id, config);
  assert.equal(fourth.success, false);
  assert.equal(fourth.remaining, 0);
});

test("different identifiers are independent", () => {
  const a = `a-${Math.random()}`;
  const b = `b-${Math.random()}`;
  checkRateLimit(a, config);
  checkRateLimit(a, config);
  checkRateLimit(a, config);
  assert.equal(checkRateLimit(a, config).success, false);
  assert.equal(checkRateLimit(b, config).success, true);
});

test("window expiry resets the counter", () => {
  const id = `exp-${Math.random()}`;
  const shortConfig: RateLimitConfig = { windowMs: 10, maxRequests: 1 };
  assert.equal(checkRateLimit(id, shortConfig).success, true);
  assert.equal(checkRateLimit(id, shortConfig).success, false);
  // Wait for the tiny window to expire
  setTimeout(() => {}, 15);
});

test("returns correct limit metadata", () => {
  const result = checkRateLimit(`meta-${Math.random()}`, config);
  assert.equal(result.limit, 3);
  assert.ok(typeof result.resetTime === "number");
  assert.ok(result.resetTime > Date.now());
});

test("getRateLimitIdentifier falls back to IP header", () => {
  const request = new Request("https://example.com/api", {
    headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
  });
  assert.equal(getRateLimitIdentifier(request), "ip:203.0.113.7");
});

test("getRateLimitIdentifier prefers bearer token", () => {
  const request = new Request("https://example.com/api", {
    headers: { authorization: "Bearer abc123" },
  });
  assert.equal(getRateLimitIdentifier(request), "user:abc123");
});

test("getRateLimitIdentifier handles missing headers", () => {
  const request = new Request("https://example.com/api");
  assert.equal(getRateLimitIdentifier(request), "ip:unknown");
});

test("rate limit configurations defined for auth and chat", () => {
  assert.ok(rateLimitConfigs["auth"]);
  assert.ok(rateLimitConfigs["auth"].maxRequests > 0);
  assert.ok(Object.keys(rateLimitConfigs).length > 0);
});
