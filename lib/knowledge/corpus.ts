/**
 * Curated Cadre AI knowledge corpus (D-02). Public-facing facts only, grounded in real cadre.ai
 * content (see decisions.md L-07). This is the bot's ONLY source of truth — the system prompt
 * forbids answering outside it. To serve another client, replace this file (part of the D-10 swap).
 *
 * Keep chunks small and single-topic so lexical retrieval returns tight, relevant context.
 */
export type KbChunk = {
  id: string;
  title: string;
  text: string;
  sourceUrl: string;
};

export const corpus: KbChunk[] = [
  {
    id: "about",
    title: "What Cadre AI does",
    text: "Cadre AI is an AI strategy and implementation consultancy. We help businesses move from AI confusion to AI confidence, going department by department to identify high-ROI AI opportunities, build workflows and agents, and train teams so the changes stick. We ship production AI systems that move revenue, compress costs, and automate work — not slide decks. Headquarters are in San Diego, California.",
    sourceUrl: "https://cadre.ai/",
  },
  {
    id: "services",
    title: "Core services",
    text: "Cadre offers four core services. AI Strategy: identify high-ROI use cases department by department and build a roadmap. AI Leadership & Facilitation: turn teams into AI champions through behavioral-science-backed training. AI Engineering: build automation and custom AI agents integrated with existing tools. AI Agents: deploy autonomous workers for complex tasks. We also provide education and training and workflow automation.",
    sourceUrl: "https://cadre.ai/strategy",
  },
  {
    id: "industries",
    title: "Industries and clients served",
    text: "Cadre serves B2B companies including professional services, private equity, financial services, mortgage and lending, real estate, construction, retail and e-commerce, manufacturing and logistics, and hospitality. Clients range from lower-middle-market private-equity-backed companies to professional services and financial services firms. If your industry is not listed, Cadre still works across many B2B sectors — the best way to check fit is to talk to an AI strategist.",
    sourceUrl: "https://cadre.ai/",
  },
  {
    id: "maturity-index",
    title: "AI Maturity Index",
    text: "The AI Maturity Index scores your organization across an eight-pillar framework for AI transformation. You receive a grade in each pillar, clear explanations, and actionable insights on how to improve and move further along your AI journey. To get scored, request your AI Maturity Index through Cadre — a strategist walks you through the results. Ask to be connected and we'll capture your details.",
    sourceUrl: "https://cadre.ai/contact",
  },
  {
    id: "portal",
    title: "Cadre client portal",
    text: "Cadre provides a centralized client portal where you can track your AI tools, agents, training, and results, with accountability metrics in one place. Portal access is provisioned by your Cadre team as part of an engagement — there is no public self-service signup. If you are a client and need access, ask and we'll connect you with your Cadre contact.",
    sourceUrl: "https://cadre.ai/",
  },
  {
    id: "llm-security",
    title: "Model selection and data security posture",
    text: "Cadre is model-agnostic: we help clients select and configure the LLM(s) that best fit their tech stack and business goals, working across providers including OpenAI, Anthropic, Google, Microsoft, and AWS. Model choice is made per use case rather than defaulting to one vendor. This assistant keeps API keys server-side and does not store your conversation. For specific security guarantees — certifications, data-retention terms, or contractual commitments — a Cadre strategist will give you accurate answers; this assistant won't guess at them.",
    sourceUrl: "https://cadre.ai/",
  },
  {
    id: "partners",
    title: "Partners",
    text: "Cadre AI is an Official OpenAI Service Partner and works with leading platforms including OpenAI, Anthropic (Claude), Google, Microsoft, AWS, Salesforce, and Snowflake, and uses OpenRouter for flexible model access. Through partnerships with Anthropic and OpenAI, Cadre gets early access to new models and capabilities.",
    sourceUrl: "https://cadre.ai/",
  },
  {
    id: "booking",
    title: "How to book a call or get started",
    text: "To get started or book a call, talk to an AI strategist via the contact page at https://cadre.ai/contact. You can also email hello@gocadre.ai or call (619) 324-3223. The fastest path is to leave your name and email here and Cadre's team will reach out to schedule.",
    sourceUrl: "https://cadre.ai/contact",
  },
  {
    id: "pricing",
    title: "Pricing",
    text: "Cadre does not publish fixed prices. Engagements are scoped to each client's goals, so pricing depends on the work involved. This assistant cannot quote a price. The best next step is a short call with a strategist who can scope your needs — leave your details and Cadre will follow up.",
    sourceUrl: "https://cadre.ai/contact",
  },
  {
    id: "getting-started",
    title: "Getting started",
    text: "A typical starting point is an AI strategy conversation: Cadre reviews your operations, identifies high-ROI opportunities, and proposes a roadmap. Many clients begin with the AI Maturity Index to benchmark where they are. Book a call through the contact page to begin.",
    sourceUrl: "https://cadre.ai/contact",
  },
];
