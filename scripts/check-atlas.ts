/**
 * Atlas connectivity + content check (reads MONGO_URI from .env.local)
 * Usage: npx tsx scripts/check-atlas.ts
 */
import * as fs from "fs";
import * as path from "path";
import mongoose from "mongoose";

// load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}


(async () => {
  const uri = process.env.MONGO_URI;
  console.log("MONGO_URI present:", !!uri, "| is Atlas SRV:", uri?.startsWith("mongodb+srv"));

  // Step 1: DNS SRV lookup
  const dns = await import("dns/promises");
  const host = uri?.match(/@([^/?]+)/)?.[1] || "";
  try {
    const records = await dns.resolveSrv(`_mongodb._tcp.${host}`);
    console.log(`✅ DNS SRV OK — ${records.length} shard hosts found`);
  } catch (e: any) {
    console.log("❌ DNS SRV lookup FAILED:", e.code || e.message);
    console.log("→ Ye aksar network/DNS blocking (VPN/firewall/ISP) ya galat cluster host ki wajah se hota hai.");
  }

  // Step 2: Full connection
  try {
    await mongoose.connect(uri!, { serverSelectionTimeoutMS: 12000 });
    console.log("✅ ATLAS CONNECT OK");
    const db = mongoose.connection.db!;
    const users = await db
      .collection("users")
      .find({}, { projection: { email: 1 } })
      .toArray();
    console.log("Users in Atlas DB:", users.map((u) => u.email));
    await mongoose.disconnect();
  } catch (e: any) {
    console.log("❌ CONNECT FAILED:", (e.message || "").substring(0, 250));
    console.log("→ name:", e.name);
  }
  process.exit(0);
})();
