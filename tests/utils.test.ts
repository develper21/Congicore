import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../src/lib/utils";

describe("utils - cn()", () => {
  it("merges standard class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500");
    assert.equal(result, "text-red-500 bg-blue-500");
  });

  it("handles conditional class names", () => {
    const isActive = true;
    const isHidden = false;
    const result = cn(
      "base-class",
      isActive && "active-class",
      isHidden && "hidden-class"
    );
    assert.equal(result, "base-class active-class");
  });

  it("resolves conflicting tailwind classes with last-wins precedence", () => {
    const result = cn("p-4", "p-8");
    assert.equal(result, "p-8");
  });

  it("handles empty and null/undefined values smoothly", () => {
    const result = cn("", undefined, null, false, "px-2");
    assert.equal(result, "px-2");
  });
});
