import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  getUserIdFromRequest,
} from "../src/lib/auth";

describe("auth - password and JWT utilities", () => {
  it("hashPassword() and verifyPassword() work with correct credentials", async () => {
    const rawPassword = "securePassword123!";
    const hashed = await hashPassword(rawPassword);

    assert.notEqual(hashed, rawPassword);
    const isValid = await verifyPassword(rawPassword, hashed);
    assert.equal(isValid, true);
  });

  it("verifyPassword() rejects incorrect credentials", async () => {
    const rawPassword = "correctPassword";
    const wrongPassword = "wrongPassword";
    const hashed = await hashPassword(rawPassword);

    const isValid = await verifyPassword(wrongPassword, hashed);
    assert.equal(isValid, false);
  });

  it("generateToken() and verifyToken() authenticate valid payload", () => {
    const userId = "user-test-uuid-123";
    const token = generateToken(userId);

    assert.ok(typeof token === "string" && token.length > 0);
    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.equal(decoded?.userId, userId);
  });

  it("verifyToken() returns null for invalid or corrupted token", () => {
    const result = verifyToken("invalid.token.payload");
    assert.equal(result, null);
  });

  it("getUserIdFromRequest() extracts userId from Authorization header", () => {
    const userId = "user-header-123";
    const token = generateToken(userId);

    const reqWithBearer = new Request("https://example.com/api/test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const extracted = getUserIdFromRequest(reqWithBearer);
    assert.equal(extracted, userId);
  });

  it("getUserIdFromRequest() returns null when Authorization header is missing or malformed", () => {
    const reqWithoutAuth = new Request("https://example.com/api/test");
    assert.equal(getUserIdFromRequest(reqWithoutAuth), null);

    const reqMalformed = new Request("https://example.com/api/test", {
      headers: {
        Authorization: "Basic somestring",
      },
    });
    assert.equal(getUserIdFromRequest(reqMalformed), null);
  });
});
