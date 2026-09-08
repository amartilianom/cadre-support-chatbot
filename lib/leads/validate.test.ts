import { describe, it, expect } from "vitest";
import { isValidEmail } from "./validate";

// FR-024: the escalation form must reject malformed emails before a lead is persisted.
describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const good of [
      "andres@t-gency.com",
      "a@b.co",
      "first.last@sub.domain.io",
      "user+tag@example.org",
    ]) {
      expect(isValidEmail(good)).toBe(true);
    }
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isValidEmail("  hello@gocadre.ai  ")).toBe(true);
  });

  it("rejects malformed or empty input", () => {
    for (const bad of [
      "",
      "   ",
      "plainstring",
      "no-at-sign.com",
      "missing@domain",
      "two@@at.com",
      "spaces in@email.com",
      "@no-local.com",
      "trailing@dot.",
    ]) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });
});
