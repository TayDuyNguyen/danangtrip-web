import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const routesFile = path.join(projectRoot, "src", "config", "routes.ts");
const appRoot = path.join(projectRoot, "src", "app");

const ACTIVE_ROUTE_GROUPS = [
  "PUBLIC_ROUTES",
  "AUTH_ROUTES",
  "PROTECTED_ROUTES",
  "DASHBOARD_ROUTES",
];

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractObjectBlock(source, objectName) {
  const marker = `export const ${objectName} = {`;
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(`Could not find ${objectName} in src/config/routes.ts`);
  }

  let depth = 0;
  let bodyStart = -1;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (char === "{") {
      depth += 1;
      if (bodyStart === -1) {
        bodyStart = index;
      }
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && bodyStart !== -1) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }

  throw new Error(`Could not parse ${objectName} in src/config/routes.ts`);
}

function extractStringRoutes(block) {
  const routes = [];
  const routePattern = /^\s*([A-Z0-9_]+)\s*:\s*"([^"]+)"\s*,?\s*$/gm;

  for (const match of block.matchAll(routePattern)) {
    routes.push({
      key: match[1],
      route: match[2],
    });
  }

  return routes;
}

function routeToPageCandidates(route) {
  const normalized = route === "/" ? "" : route.replace(/^\/+|\/+$/g, "");

  if (normalized === "") {
    return [
      path.join(appRoot, "[locale]", "(main)", "page.tsx"),
      path.join(appRoot, "[locale]", "page.tsx"),
      path.join(appRoot, "page.tsx"),
    ];
  }

  const segments = normalized.split("/");
  const relativePath = path.join(...segments, "page.tsx");

  return [
    path.join(appRoot, "[locale]", "(main)", "(public)", relativePath),
    path.join(appRoot, "[locale]", "(main)", "(protected)", relativePath),
    path.join(appRoot, "[locale]", "(auth)", relativePath),
    path.join(appRoot, "[locale]", "(main)", relativePath),
    path.join(appRoot, "[locale]", relativePath),
    path.join(appRoot, relativePath),
  ];
}

function routeExists(route) {
  return routeToPageCandidates(route).some((candidate) => fs.existsSync(candidate));
}

function main() {
  const source = readFile(routesFile);
  const findings = [];
  const verified = [];

  for (const groupName of ACTIVE_ROUTE_GROUPS) {
    const block = extractObjectBlock(source, groupName);
    const routes = extractStringRoutes(block);

    for (const entry of routes) {
      if (routeExists(entry.route)) {
        verified.push(`${groupName}.${entry.key} -> ${entry.route}`);
      } else {
        findings.push(`${groupName}.${entry.key} -> ${entry.route}`);
      }
    }
  }

  if (findings.length === 0) {
    console.log("[OK] Route check passed");
    console.log(`[OK] Verified ${verified.length} active route entries`);
    process.exit(0);
  }

  console.error("[X] Route check failed");
  console.error("[X] Active route entries without a matching page:");
  for (const finding of findings) {
    console.error(`  - ${finding}`);
  }
  console.error("");
  console.error("Fix the route config or create the missing pages before pushing.");
  process.exit(1);
}

main();
