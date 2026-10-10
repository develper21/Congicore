import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  getRateLimitConfig,
  rateLimitConfigs,
} from "../src/lib/rate-limit";

describe("rate-limit middleware & utility", () => {
  it("checkRateLimit() allows requests under limit and blocks requests exceeding limit", () => {
    const identifier = `test-ip-${Date.now()}`;
    const config = { windowMs: 60000, maxRequests: 3 };

    const first = checkRateLimit(identifier, config);
    assert.equal(first.success, true);
    assert.equal(first.remaining, 2);

    const second = checkRateLimit(identifier, config);
    assert.equal(second.success, true);
    assert.equal(second.remaining, 1);

    const third = checkRateLimit(identifier, config);
    assert.equal(third.success, true);
    assert.equal(third.remaining, 0);

    const fourth = checkRateLimit(identifier, config);
    assert.equal(fourth.success, false);
    assert.equal(fourth.remaining, 0);
  });

  it("getRateLimitConfig() resolves correct config by path", () => {
    assert.deepEqual(getRateLimitConfig("/api/auth/login"), rateLimitConfigs.auth);
    assert.deepEqual(getRateLimitConfig("/api/chat/message"), rateLimitConfigs.chat);
    assert.deepEqual(getRateLimitConfig("/api/documents/search"), rateLimitConfigs.documents);
    assert.deepEqual(getRateLimitConfig("/api/memories/123"), rateLimitConfigs.memories);
    assert.deepEqual(getRateLimitConfig("/api/search"), rateLimitConfigs.search);
    assert.deepEqual(getRateLimitConfig("/api/upload"), rateLimitConfigs.upload);
    assert.deepEqual(getRateLimitConfig("/api/unknown/endpoint"), rateLimitConfigs.default);
  });

  it("getRateLimitIdentifier() extracts token identifier or falls back to IP", () => {
    const reqWithBearer = new Request("https://example.com/api/test", {
      headers: {
        Authorization: "Bearer token-xyz-789",
      },
    });
    assert.equal(getRateLimitIdentifier(reqWithBearer), "user:token-xyz-789");

    const reqWithIp = new Request("https://example.com/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.100, 10.0.0.1",
      },
    });
    assert.equal(getRateLimitIdentifier(reqWithIp), "ip:192.168.1.100");

    const reqEmpty = new Request("https://example.com/api/test");
    assert.equal(getRateLimitIdentifier(reqEmpty), "ip:unknown");
  });
});
