import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadLoop · Find your next 1,000 customers",
  description:
    "LeadLoop turns the Apify Leads Finder API into a beautiful pastel SaaS for sales teams. Filter, save, and export leads in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
