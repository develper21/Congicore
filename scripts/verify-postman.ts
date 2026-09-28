/**
 * Verifies every Next.js API route in src/app/api is covered in postman/postman.json
 * Usage: npx tsx scripts/verify-postman.ts
 */
import * as fs from "fs";
import * as path from "path";

function findRoutes(dir: string, base = ""): string[] {
  let out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? base + "/" + e.name : e.name;
    if (e.isDirectory()) out = out.concat(findRoutes(path.join(dir, e.name), rel));
    else if (e.name === "route.ts") out.push(base);
  }
  return out;
}

const routes = findRoutes("src/app/api").map((r) =>
  "/api/" + r.replace(/\[(\.\.\.)?([^\]]+)\]/g, "{{$2}}"),
);

const collection = JSON.parse(
  fs.readFileSync("postman/postman.json", "utf8"),
);
const collected = new Set<string>();
const walk = (items: any[]) => {
  for (const it of items) {
    if (it.item) walk(it.item);
    else if (it.request?.url?.raw)
      collected.add(
        it.request.url.raw
          .replace(/\{\{baseUrl\}\}/, "")
          .replace(/^https?:\/\/[^/]+/, "")
          .split("?")[0],
      );
  }
};
walk(collection.item);

// Postman uses named vars like {{id}}; match dynamic segments by position
const normalize = (p: string) =>
  p
    .split("/")
    .map((seg) => (/^\{\{.+\}\}$/.test(seg) ? "*" : seg))
    .join("/");
const normalizedCollected = new Set([...collected].map(normalize));

const missing = routes.filter(
  (r) => !collected.has(r) && !normalizedCollected.has(normalize(r)),
);
const extra = [...collected].filter(
  (c) => !routes.includes(c),
);

console.log(`Project API routes : ${routes.length}`);
console.log(`Postman requests   : ${collected.size}`);
if (missing.length === 0) {
  console.log("✅ FULL COVERAGE — every project route is in the Postman collection");
} else {
  console.log("❌ Missing routes:");
  missing.forEach((m) => console.log("  -", m));
  process.exit(1);
}
if (extra.length) {
  console.log("ℹ In Postman but no matching route.ts (informational):");
  extra.forEach((m) => console.log("  -", m));
}
