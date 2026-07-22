#!/usr/bin/env node
/**
 * Deploy the Medusa backend to Railway.
 *
 * Why this script exists: `railway up` uploads from the git root, which makes
 * Nixpacks install BOTH workspaces (Medusa + the Next.js storefront). That
 * exceeds Railway's build timeout. So we stage apps/backend -- which is fully
 * self-contained -- into its own folder and deploy that instead.
 *
 * Usage:  node scripts/deploy-backend.mjs
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(repoRoot, "apps", "backend");
const stage = join(tmpdir(), "cylix-be-deploy");

const PROJECT = "balanced-compassion";
const SERVICE = "dynamic-liberation";

// Build/start config that fits inside Railway's build timeout.
// Runtime deps are installed at BUILD time so the container boots fast.
const railwayJson = {
  $schema: "https://railway.com/railway.schema.json",
  build: {
    builder: "NIXPACKS",
    buildCommand:
      "npm run build && cd .medusa/server && npm install --omit=dev --no-audit --no-fund",
  },
  deploy: {
    startCommand:
      'cd .medusa/server && npx medusa db:migrate && (npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" || echo "admin user exists, continuing") && npx medusa start',
    restartPolicyType: "ON_FAILURE",
    restartPolicyMaxRetries: 3,
  },
};

if (!existsSync(src)) {
  console.error("Cannot find apps/backend at", src);
  process.exit(1);
}

console.log("Staging backend ->", stage);
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

cpSync(src, stage, {
  recursive: true,
  filter: (p) => !/[\\/](node_modules|\.medusa|dist|\.cache)([\\/]|$)/.test(p),
});

writeFileSync(join(stage, "railway.json"), JSON.stringify(railwayJson, null, 2));
// Make sure the upload never carries build artefacts.
writeFileSync(join(stage, ".gitignore"), "node_modules\n.medusa\ndist\n.cache\n.env\n");

const run = (cmd) => {
  console.log("\n$ " + cmd);
  execSync(cmd, { cwd: stage, stdio: "inherit", shell: true });
};

run(`railway link --project ${PROJECT} --service ${SERVICE}`);
run(`railway up --service ${SERVICE} --ci --detach`);

console.log(`
Deploy triggered. It takes a few minutes.

Watch it:      railway logs --build
Check health:  curl https://dynamic-liberation-production-c2cb.up.railway.app/health
`);
