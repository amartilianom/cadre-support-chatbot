/**
 * SECOND CLIENT CORPUS — a fictional demo client used to prove the reuse thesis (AC-16). Nothing
 * here is real; "Northwind Freight" is invented. Selecting it via CLIENT_PROFILE=northwind re-skins
 * the entire bot (corpus, persona, brand, CTA, escalation) with zero code changes. This file IS the
 * client-specific swap — a new client is a new corpus + a new ClientProfile, not new code.
 */
import type { KbChunk } from "./corpus";

export const northwindCorpus: KbChunk[] = [
  {
    id: "about",
    title: "What Northwind Freight does",
    text: "Northwind Freight is a business freight brokerage that moves shipments across North America. We match your loads to vetted carriers, handle the paperwork, and give you one point of contact from quote to delivery. We focus on reliability and clear communication over the lowest possible rate.",
    sourceUrl: "https://northwind.example/",
  },
  {
    id: "services",
    title: "Services",
    text: "Northwind offers less-than-truckload (LTL) and full-truckload (FTL) shipping, expedited and time-critical freight, and basic warehousing and cross-docking. We coordinate pickup, transit, and delivery, and keep you updated at each step.",
    sourceUrl: "https://northwind.example/services",
  },
  {
    id: "coverage",
    title: "Coverage and industries",
    text: "Northwind ships across the United States, Canada, and Mexico. We work with manufacturers, distributors, retailers, and construction suppliers. If you're not sure we cover your lane, ask our team and we'll confirm.",
    sourceUrl: "https://northwind.example/coverage",
  },
  {
    id: "tracking",
    title: "Tracking a shipment",
    text: "Active Northwind customers can track shipments through their account dashboard, which shows pickup, transit, and delivery status. Access to the dashboard is set up by your Northwind account manager when your account is created.",
    sourceUrl: "https://northwind.example/",
  },
  {
    id: "pricing",
    title: "Pricing and quotes",
    text: "Northwind does not publish fixed rates because freight pricing depends on lane, weight, dimensions, timing, and accessorials. This assistant cannot quote a price. Share your shipment details with our team and we'll send a quote.",
    sourceUrl: "https://northwind.example/contact",
  },
  {
    id: "contact",
    title: "How to get a quote or reach us",
    text: "To get a quote or start shipping, contact the Northwind team at https://northwind.example/contact, email hello@northwind.example, or call (555) 010-2200. The fastest way is to leave your name and email here and we'll follow up.",
    sourceUrl: "https://northwind.example/contact",
  },
];
