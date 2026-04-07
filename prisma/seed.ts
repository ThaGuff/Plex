import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PLANS } from "../lib/plans";

const prisma = new PrismaClient();

async function main() {
  console.log("[seed] starting…");

  // Plans
  for (const p of PLANS) {
    await prisma.plan.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        priceCents: p.priceCents,
        searchesPerMo: p.searchesPerMo,
        exportsPerMo: p.exportsPerMo,
        features: JSON.stringify(p.features),
        highlight: p.highlight ?? false,
        sortOrder: p.sortOrder,
      },
      create: {
        id: p.id,
        name: p.name,
        priceCents: p.priceCents,
        searchesPerMo: p.searchesPerMo,
        exportsPerMo: p.exportsPerMo,
        features: JSON.stringify(p.features),
        highlight: p.highlight ?? false,
        sortOrder: p.sortOrder,
      },
    });
  }
  console.log(`[seed] plans: ${PLANS.length}`);

  // Admin
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@leadloop.dev").toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || "admin1234";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", planId: "scale", status: "active" },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 10),
      name: "Admin",
      role: "admin",
      planId: "scale",
      status: "active",
    },
  });
  console.log(`[seed] admin: ${adminEmail} / ${adminPass}`);

  // Demo user
  const demoEmail = (process.env.DEMO_EMAIL || "demo@leadloop.dev").toLowerCase();
  const demoPass = process.env.DEMO_PASSWORD || "demo1234";
  await prisma.user.upsert({
    where: { email: demoEmail },
    update: { planId: "pro", status: "active" },
    create: {
      email: demoEmail,
      passwordHash: await bcrypt.hash(demoPass, 10),
      name: "Demo Customer",
      company: "Brightway Studios",
      role: "user",
      planId: "pro",
      status: "active",
    },
  });
  console.log(`[seed] demo user: ${demoEmail} / ${demoPass}`);

  // A few extra users for admin console listing
  const extras = [
    { email: "ava@northwindhvac.com", name: "Ava Chen", company: "Northwind HVAC", planId: "starter" },
    { email: "leo@crescentroofs.com", name: "Leo Park", company: "Crescent Roofing", planId: "free" },
    { email: "mira@hellokombucha.com", name: "Mira Patel", company: "Hello Kombucha", planId: "pro" },
    { email: "sam@apexplumbing.com", name: "Sam Reyes", company: "Apex Plumbing", planId: "starter" },
    { email: "noa@forgecoffee.com", name: "Noa Brooks", company: "Forge Coffee", planId: "scale" },
  ];
  for (const e of extras) {
    await prisma.user.upsert({
      where: { email: e.email },
      update: {},
      create: {
        email: e.email,
        passwordHash: await bcrypt.hash("password123", 10),
        name: e.name,
        company: e.company,
        role: "user",
        planId: e.planId,
        status: "active",
      },
    });
  }
  console.log(`[seed] extras: ${extras.length}`);

  console.log("[seed] done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
