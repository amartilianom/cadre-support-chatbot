/**
 * ClientProfile — the single configuration surface that re-skins the bot for a client (D-10).
 * Swap this object (and the corpus it points at) and the same shell serves a different client
 * with no code changes. This is the "conversational system" block's parameterization.
 */
export type EscalationTarget = {
  bookingUrl: string;
  contactEmail: string;
  contactPhone: string;
};

export type ClientProfile = {
  /** Legal/display name of the client the bot represents. */
  clientName: string;
  brand: {
    productName: string;
    tagline: string;
    /** Accent colour (hex) used by the UI. */
    accentColor: string;
  };
  /** OpenRouter model slug. Env override wins so it is swappable without a redeploy (FR-031, D-04). */
  model: string;
  /** Where escalations route: booking link, email, phone. */
  escalation: EscalationTarget;
};

export const cadreProfile: ClientProfile = {
  clientName: "Cadre AI",
  brand: {
    productName: "Cadre AI Assistant",
    tagline: "From AI Confusion to AI Confidence.",
    accentColor: "#DB4545",
  },
  model: process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-flash",
  escalation: {
    bookingUrl: "https://cadre.ai/contact",
    contactEmail: "hello@gocadre.ai",
    contactPhone: "(619) 324-3223",
  },
};

/** The active profile. A multi-client deployment would resolve this per host/tenant. */
export const activeProfile: ClientProfile = cadreProfile;
