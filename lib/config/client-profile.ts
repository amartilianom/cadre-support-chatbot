/**
 * ClientProfile — the single configuration surface that re-skins the bot for a client (D-10).
 * Everything client-specific lives here: corpus, persona/voice, brand, model, escalation target,
 * CTA, greeting, and starter prompts. Selecting a profile via the CLIENT_PROFILE env var swaps ALL
 * of it with zero code changes — this is the "conversational system" block's parameterization, and
 * the mechanism behind acceptance criterion AC-16.
 */
import { cadreCorpus, type KbChunk } from "@/lib/knowledge/corpus";
import { northwindCorpus } from "@/lib/knowledge/corpus.northwind";

export type EscalationTarget = {
  bookingUrl: string;
  contactEmail: string;
  contactPhone: string;
};

export type ClientProfile = {
  /** Stable id; also the CLIENT_PROFILE value that selects this profile. */
  id: string;
  clientName: string;
  brand: {
    productName: string;
    tagline: string;
    /** Accent colour (hex) used by the UI. */
    accentColor: string;
    /** Escalation button / CTA label. */
    ctaLabel: string;
  };
  /** First assistant message shown in the chat. */
  greeting: string;
  /** Starter suggestion chips. */
  suggestions: string[];
  /** OpenRouter model slug. Env override wins so it is swappable without a redeploy (FR-031, D-04). */
  model: string;
  escalation: EscalationTarget;
  /** The knowledge this profile grounds answers in (D-02). */
  corpus: KbChunk[];
};

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-flash";

export const cadreProfile: ClientProfile = {
  id: "cadre",
  clientName: "Cadre AI",
  brand: {
    productName: "Cadre AI Assistant",
    tagline: "From AI Confusion to AI Confidence.",
    accentColor: "#DB4545",
    ctaLabel: "Talk to an AI Strategist",
  },
  greeting:
    "Hi! I'm the Cadre AI assistant. Ask me what Cadre does, which industries we work with, about the AI Maturity Index, or how to book a call with a strategist.",
  suggestions: [
    "What does Cadre AI do?",
    "What's the AI Maturity Index?",
    "Do you work with private equity?",
    "How do I book a call?",
  ],
  model: DEFAULT_MODEL,
  escalation: {
    bookingUrl: "https://cadre.ai/contact",
    contactEmail: "hello@gocadre.ai",
    contactPhone: "(619) 324-3223",
  },
  corpus: cadreCorpus,
};

/** Fictional second client — proves the shell re-skins by config alone (AC-16). Set CLIENT_PROFILE=northwind. */
export const northwindProfile: ClientProfile = {
  id: "northwind",
  clientName: "Northwind Freight",
  brand: {
    productName: "Northwind Freight Assistant",
    tagline: "Freight, handled.",
    accentColor: "#1E5FBF",
    ctaLabel: "Talk to our team",
  },
  greeting:
    "Hi! I'm the Northwind Freight assistant. Ask me what we ship, where we cover, how to track a shipment, or how to get a quote.",
  suggestions: [
    "What does Northwind do?",
    "Do you ship to Canada?",
    "How do I track a shipment?",
    "How do I get a quote?",
  ],
  model: DEFAULT_MODEL,
  escalation: {
    bookingUrl: "https://northwind.example/contact",
    contactEmail: "hello@northwind.example",
    contactPhone: "(555) 010-2200",
  },
  corpus: northwindCorpus,
};

const profiles: Record<string, ClientProfile> = {
  cadre: cadreProfile,
  northwind: northwindProfile,
};

/** The active profile, resolved once from CLIENT_PROFILE (defaults to Cadre). */
export const activeProfile: ClientProfile =
  profiles[process.env.CLIENT_PROFILE ?? "cadre"] ?? cadreProfile;
