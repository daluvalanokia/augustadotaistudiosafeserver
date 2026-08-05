/**
 * github-push.mjs
 * Push project files to a GitHub repository via the Git Data API.
 *
 * Usage:
 *   node scripts/github-push.mjs                          # push to default repo
 *   node scripts/github-push.mjs --name my-repo          # push to a named repo (creates it if absent)
 *   node scripts/github-push.mjs --name my-repo --private # create as private repo
 *
 * Options:
 *   --name <repo>     Target repository name (default: juneairwaysresafeserver)
 *   --private         Create repo as private (only applies if repo is being created)
 *   --description     Repository description string
 */

import fs from "fs";
import path from "path";

// ── CLI arg parsing ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}
const isPrivate = args.includes("--private");
const OWNER = "daluvalanokia";
const REPO = getArg("--name") || "augustaairwaysaistudiosafeserver";
const DESCRIPTION = getArg("--description") || "Augusta Airways MergeSafe - Augusta Air & Ground Traffic Synchronization Platform";

console.log(`Target repo : ${OWNER}/${REPO}`);
console.log(`Visibility  : ${isPrivate ? "private" : "public"}`);

const TOKEN = getArg("--token") || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function ghApi(endpoint, options = {}) {
  if (TOKEN) {
    const url = `https://api.github.com${endpoint}`;
    const headers = {
      "Authorization": `Bearer ${TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "AIStudio-GitHub-Pusher",
      ...(options.headers || {})
    };
    const resp = await fetch(url, { ...options, headers });
    const data = await resp.json();
    return data;
  } else {
    try {
      const { ReplitConnectors } = await import("@replit/connectors-sdk");
      const connectors = new ReplitConnectors();
      const resp = await connectors.proxy("github", endpoint, options);
      return await resp.json();
    } catch (err) {
      throw new Error(`GitHub Authentication Error: No GITHUB_TOKEN environment variable or --token option provided, and ReplitConnectors proxy is unavailable. (${err.message})`);
    }
  }
}

async function ghPost(endpoint, body) {
  return ghApi(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function ghPatch(endpoint, body) {
  return ghApi(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── File collection ────────────────────────────────────────────────────────────
const ROOT_FILES = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "tsconfig.base.json",
  "metadata.json",
  "replit.md",
  "replit.nix",
  ".gitignore",
  "bun.lock"
];

const SKIP_EXTENSIONS = new Set([".db", ".db-shm", ".db-wal"]);
const SKIP_DIRS = new Set(["obj", "bin", "node_modules", ".git", "dist", ".generated", "coverage", ".turbo", ".cache"]);

function collectFiles(dir, base = "") {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectFiles(full, rel));
    } else {
      if (!SKIP_EXTENSIONS.has(path.extname(entry).toLowerCase())) {
        results.push({ full, rel });
      }
    }
  }
  return results;
}

async function createBlob(filePath, retries = 5) {
  const buf = fs.readFileSync(filePath);
  const isBinary = buf.slice(0, 8192).includes(0x00);
  const encoding = isBinary ? "base64" : "utf-8";
  const content = isBinary ? buf.toString("base64") : buf.toString("utf-8");
  for (let attempt = 1; attempt <= retries; attempt++) {
    const blob = await ghPost(`/repos/${OWNER}/${REPO}/git/blobs`, { content, encoding });
    if (blob.sha) return blob.sha;
    const isRateLimit = JSON.stringify(blob).includes("Rate limit");
    if (isRateLimit && attempt < retries) {
      const wait = attempt * 1500;
      process.stdout.write(`[rate-limit, retry ${attempt}/${retries} in ${wait}ms]`);
      await new Promise(r => setTimeout(r, wait));
    } else {
      throw new Error(`No SHA returned for ${filePath}: ${JSON.stringify(blob)}`);
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Ensure the repo exists (create if missing)
  const repoInfo = await ghApi(`/repos/${OWNER}/${REPO}`);
  if (repoInfo.message === "Not Found") {
    console.log("Repository not found — creating it...");
    const created = await ghPost("/user/repos", {
      name: REPO,
      description: DESCRIPTION,
      private: isPrivate,
      auto_init: true,
    });
    if (!created.full_name) {
      console.error("Failed to create repo:", JSON.stringify(created, null, 2));
      process.exit(1);
    }
    console.log("Created:", created.html_url);
    // Small delay for GitHub to initialise the default branch
    await new Promise(r => setTimeout(r, 2000));
  } else {
    console.log("Repository exists:", repoInfo.html_url);
  }

  // 2. Collect files
  const files = [];
  for (const f of ROOT_FILES) {
    if (fs.existsSync(f)) files.push({ full: f, rel: f });
  }
  files.push(...collectFiles("artifacts", "artifacts"));
  files.push(...collectFiles("lib", "lib"));
  files.push(...collectFiles("scripts", "scripts"));
  files.push(...collectFiles("attached_assets", "attached_assets"));

  console.log(`Files to push: ${files.length}`);

  // 3. Get HEAD commit of main branch
  const refData = await ghApi(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  if (!refData.object) {
    console.error("Could not resolve main branch ref:", JSON.stringify(refData));
    process.exit(1);
  }
  const baseCommitSha = refData.object.sha;
  const baseCommit = await ghApi(`/repos/${OWNER}/${REPO}/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha;
  console.log(`Base commit : ${baseCommitSha.slice(0, 7)}  tree: ${baseTreeSha.slice(0, 7)}`);

  // 4. Create blobs in parallel batches of 3 (keeps well under 10 RPS limit)
  const BATCH = 3;
  const treeItems = [];
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async ({ full, rel }) => {
        try {
          const sha = await createBlob(full);
          process.stdout.write(".");
          return { path: rel, mode: "100644", type: "blob", sha };
        } catch (e) {
          console.error(`\nBlob failed for ${rel}: ${e.message}`);
          return null;
        }
      })
    );
    treeItems.push(...results.filter(Boolean));
  }
  console.log(`\nBlobs created: ${treeItems.length}`);

  // 5. Create tree → commit → update ref
  const newTree = await ghPost(`/repos/${OWNER}/${REPO}/git/trees`, {
    base_tree: baseTreeSha,
    tree: treeItems,
  });
  console.log("New tree    :", newTree.sha?.slice(0, 7));

  const newCommit = await ghPost(`/repos/${OWNER}/${REPO}/git/commits`, {
    message: `Push: AirwaysMergeSafeServer project (${new Date().toISOString().slice(0, 10)})`,
    tree: newTree.sha,
    parents: [baseCommitSha],
  });
  console.log("New commit  :", newCommit.sha?.slice(0, 7));

  const updated = await ghPatch(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    sha: newCommit.sha,
    force: false,
  });
  if (updated.object) {
    console.log("\nDone! https://github.com/" + OWNER + "/" + REPO);
  } else {
    console.error("Ref update failed:", JSON.stringify(updated));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
