export type PlanSeed = {
  id: string;
  name: string;
  priceCents: number;
  searchesPerMo: number;
  exportsPerMo: number;
  features: string[];
  highlight?: boolean;
  sortOrder: number;
};

export const PLANS: PlanSeed[] = [
  {
    id: "free",
    name: "Free",
    priceCents: 0,
    searchesPerMo: 5,
    exportsPerMo: 1,
    features: [
      "5 lead searches / month",
      "1 CSV export / month",
      "Up to 25 results per search",
      "Email support",
    ],
    sortOrder: 1,
  },
  {
    id: "starter",
    name: "Starter",
    priceCents: 2900,
    searchesPerMo: 50,
    exportsPerMo: 10,
    features: [
      "50 lead searches / month",
      "10 CSV exports / month",
      "Up to 100 results per search",
      "Saved leads board",
      "Search history",
      "Email support",
    ],
    sortOrder: 2,
  },
  {
    id: "pro",
    name: "Pro",
    priceCents: 7900,
    searchesPerMo: 250,
    exportsPerMo: 100,
    features: [
      "250 lead searches / month",
      "100 CSV exports / month",
      "Up to 250 results per search",
      "All filter dimensions",
      "Saved leads + pipeline stages",
      "Notes + tags",
      "Priority email support",
    ],
    highlight: true,
    sortOrder: 3,
  },
  {
    id: "scale",
    name: "Scale",
    priceCents: 19900,
    searchesPerMo: 1500,
    exportsPerMo: 1000,
    features: [
      "1,500 lead searches / month",
      "1,000 CSV exports / month",
      "Up to 500 results per search",
      "Multi-seat (5 users)",
      "Webhooks + API access",
      "Slack + Zapier",
      "Dedicated success manager",
    ],
    sortOrder: 4,
  },
];

export function planById(id: string): PlanSeed {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "$0";
  return `$${(cents / 100).toFixed(0)}`;
}
