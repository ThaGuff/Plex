// Apify "Leads Finder" actor integration with mock fallback.
// Actor: https://apify.com/code_crafter/leads-finder

export type LeadFilters = {
  industry?: string;
  keyword?: string;
  location?: string;
  city?: string;
  country?: string;
  jobTitle?: string;
  minEmployees?: number;
  maxEmployees?: number;
  hasEmail?: boolean;
  hasPhone?: boolean;
  limit?: number;
};

export type LeadResult = {
  externalId: string;
  name: string | null;
  title: string | null;
  company: string | null;
  industry: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  employees: string | null;
  revenue: string | null;
  description: string | null;
  tags: string[];
  score: number;
  raw?: unknown;
};

export type SearchResponse = {
  source: "apify" | "mock";
  count: number;
  leads: LeadResult[];
};

const APIFY_BASE = "https://api.apify.com/v2";
const ACTOR_ID = process.env.APIFY_ACTOR_ID || "code_crafter~leads-finder";

export function apifyMode(): "live" | "demo" {
  return process.env.APIFY_TOKEN ? "live" : "demo";
}

/* ------------------------------------------------------------------ */
/*  LIVE — calls Apify run-sync-get-dataset-items                     */
/* ------------------------------------------------------------------ */
async function callApify(filters: LeadFilters): Promise<LeadResult[]> {
  const token = process.env.APIFY_TOKEN!;
  const url = `${APIFY_BASE}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${token}`;

  const input = {
    keyword: filters.keyword,
    industry: filters.industry,
    location: filters.location || filters.city || filters.country,
    jobTitle: filters.jobTitle,
    minEmployees: filters.minEmployees,
    maxEmployees: filters.maxEmployees,
    requireEmail: filters.hasEmail,
    requirePhone: filters.hasPhone,
    maxItems: filters.limit ?? 50,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error(`Apify error: ${res.status} ${res.statusText}`);
  const items = (await res.json()) as Record<string, unknown>[];
  return items.map(normalizeApifyItem);
}

function normalizeApifyItem(it: Record<string, unknown>): LeadResult {
  const get = (k: string) => (it[k] != null ? String(it[k]) : null);
  return {
    externalId: get("id") ?? get("uid") ?? cryptoId(),
    name: get("name") ?? get("fullName"),
    title: get("title") ?? get("jobTitle"),
    company: get("company") ?? get("companyName"),
    industry: get("industry"),
    location:
      get("location") ??
      ([get("city"), get("state"), get("country")].filter(Boolean).join(", ") || null),
    email: get("email"),
    phone: get("phone") ?? get("phoneNumber"),
    website: get("website") ?? get("domain"),
    linkedinUrl: get("linkedin") ?? get("linkedinUrl"),
    twitterUrl: get("twitter") ?? get("twitterUrl"),
    facebookUrl: get("facebook") ?? get("facebookUrl"),
    employees: get("employees") ?? get("employeeRange"),
    revenue: get("revenue") ?? get("annualRevenue"),
    description: get("description") ?? get("bio"),
    tags: Array.isArray(it.tags) ? (it.tags as string[]) : [],
    score: typeof it.score === "number" ? (it.score as number) : 0,
    raw: it,
  };
}

function cryptoId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ------------------------------------------------------------------ */
/*  MOCK — realistic synthetic dataset                                */
/* ------------------------------------------------------------------ */
const FIRST_NAMES = ["Avery","Jordan","Taylor","Riley","Cameron","Morgan","Quinn","Reese","Sasha","Drew","Ellis","Hayden","Logan","Parker","Skyler","Rowan","Emerson","Finley","Harper","Indigo","Jules","Kai","Lennon","Marlowe","Noa","Orion","Phoenix","Remy","Sloane","Tatum"];
const LAST_NAMES = ["Hart","Vega","Quinn","Park","Mori","Knox","Cole","Reyes","Singh","Patel","Nakamura","Chen","Lopez","Rivera","Bennett","Carter","Sato","Brooks","Diaz","Price","Yuen","Holt","Sanders","Murphy","Walsh","Larsen","Becker","Dunn","Foley","Garner"];
const TITLES = ["Founder & CEO","Head of Marketing","VP of Sales","Director of Operations","Marketing Manager","Account Executive","Growth Lead","Customer Success Manager","Product Manager","Co-Founder","Sales Development Rep","Owner","Managing Partner","Director of Demand Gen","Chief Revenue Officer"];
const COMPANIES = ["Brightway Studios","Northwind HVAC","Crescent Roofing","Loop & Co","Wildtree Bakery","Atlas Print Shop","Sierra Dental","Fernwood Vet","Apex Plumbing","Hello Kombucha","Polar Plunge Spa","Modern Lawn Co","Forge Coffee","Cascade Fitness","Riverbend Lodge","Velvet Boutique","Pixel Salon","Highland Auto","Blue Anchor Marina","Maple & Oak Co","Rooted Wellness","Honest Pies","Citrus Cycle","Glasshouse Gallery","Stone Path Realty","Driftwood Inn","Lantern Tea House","Saltwater Surf","Field Note Bookshop","Compass Outdoor"];
const INDUSTRIES = ["Home Services","Hospitality","Retail","Health & Wellness","Professional Services","Automotive","Real Estate","Food & Beverage","Fitness","Beauty","Technology","Legal","Financial","Construction","Education","Non-Profit"];
const CITIES = ["Birmingham, AL","Nashville, TN","Austin, TX","Denver, CO","Portland, OR","Asheville, NC","Charleston, SC","Salt Lake City, UT","Tucson, AZ","Boise, ID","Madison, WI","Burlington, VT","Bozeman, MT","Santa Fe, NM","Savannah, GA","Reno, NV","Spokane, WA","Lincoln, NE","Boulder, CO","Athens, GA"];
const EMP_RANGES = ["1-10","11-50","51-200","201-500","500-1000"];
const REV_RANGES = ["$0 - $1M","$1M - $5M","$5M - $10M","$10M - $50M","$50M+"];

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

function buildMockLead(seed: number, filters: LeadFilters): LeadResult {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const last = LAST_NAMES[(seed * 7) % LAST_NAMES.length];
  const company = filters.keyword
    ? `${capitalize(filters.keyword)} ${pick(["Co","Group","Studio","Labs","Works"])}`
    : COMPANIES[(seed * 3) % COMPANIES.length];
  const industry = filters.industry || INDUSTRIES[(seed * 11) % INDUSTRIES.length];
  const city = filters.location || filters.city || CITIES[(seed * 5) % CITIES.length];
  const slug = company.toLowerCase().replace(/[^a-z]/g, "");
  const email = `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.com`;
  const phone = `+1 ${200 + (seed % 700)}-${100 + (seed % 800)}-${1000 + (seed % 9000)}`;
  return {
    externalId: `mock_${seed}_${Date.now()}`,
    name: `${first} ${last}`,
    title: filters.jobTitle || TITLES[(seed * 13) % TITLES.length],
    company,
    industry,
    location: city,
    email: filters.hasEmail === false ? null : email,
    phone: filters.hasPhone === false ? null : phone,
    website: `https://${slug}.com`,
    linkedinUrl: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
    twitterUrl: seed % 3 === 0 ? `https://twitter.com/${slug}` : null,
    facebookUrl: seed % 4 === 0 ? `https://facebook.com/${slug}` : null,
    employees: EMP_RANGES[(seed * 2) % EMP_RANGES.length],
    revenue: REV_RANGES[(seed * 6) % REV_RANGES.length],
    description: `${company} is a ${industry.toLowerCase()} business based in ${city}. They focus on serving local customers and growing through word of mouth and digital channels.`,
    tags: [industry, city.split(",")[0], pick(["Decision Maker","Influencer","Champion"])],
    score: 60 + ((seed * 17) % 40),
  };
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function mockSearch(filters: LeadFilters): LeadResult[] {
  const limit = Math.max(5, Math.min(filters.limit ?? 25, 100));
  return Array.from({ length: limit }, (_, i) => buildMockLead(i + 1, filters));
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */
export async function searchLeads(filters: LeadFilters): Promise<SearchResponse> {
  if (apifyMode() === "live") {
    try {
      const leads = await callApify(filters);
      return { source: "apify", count: leads.length, leads };
    } catch (err) {
      console.error("[apify] live call failed, falling back to mock:", err);
    }
  }
  const leads = mockSearch(filters);
  return { source: "mock", count: leads.length, leads };
}

export function leadsToCsv(leads: LeadResult[]): string {
  const cols: (keyof LeadResult)[] = [
    "name","title","company","industry","location","email","phone","website",
    "linkedinUrl","twitterUrl","facebookUrl","employees","revenue","score",
  ];
  const head = cols.join(",");
  const body = leads
    .map((l) =>
      cols
        .map((c) => {
          const v = l[c];
          if (v == null) return "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    )
    .join("\n");
  return `${head}\n${body}`;
}
