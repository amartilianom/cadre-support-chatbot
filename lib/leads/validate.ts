/**
 * Lead input validation (FR-024). Extracted as a pure, dependency-free function so the escalation
 * seam's one piece of real input validation is unit-testable without booting the /api/lead route.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when `email` looks like a syntactically valid address. Trims first (route already slices). */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}
