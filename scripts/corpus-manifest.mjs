import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const corpusRoot = resolve(repositoryRoot, "src", "corpus");
const manifestPath = resolve(repositoryRoot, "corpus-manifest.json");

async function listTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listTypeScriptFiles(path);
      return entry.isFile() && entry.name.endsWith(".ts") ? [path] : [];
    }),
  );
  return nested.flat();
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function buildManifest() {
  const paths = (await listTypeScriptFiles(corpusRoot)).sort((left, right) =>
    left.localeCompare(right, "en"),
  );
  const files = [];

  for (const absolutePath of paths) {
    const path = relative(repositoryRoot, absolutePath).split(sep).join("/");
    files.push({ path, sha256: sha256(await readFile(absolutePath)) });
  }

  const aggregate = files
    .map(({ path, sha256: hash }) => `${path}\0${hash}\n`)
    .join("");
  return {
    algorithm: "sha256",
    corpusSha256: sha256(aggregate),
    files,
  };
}

const args = new Set(process.argv.slice(2));
const manifest = await buildManifest();
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;

if (args.has("--write")) {
  await writeFile(manifestPath, serialized, "utf8");
}

if (args.has("--check")) {
  const committed = await readFile(manifestPath, "utf8");
  if (committed !== serialized) {
    throw new Error(
      "corpus-manifest.json is stale; run npm run manifest:write",
    );
  }
}

if (args.has("--print-hash")) {
  process.stdout.write(`${manifest.corpusSha256}\n`);
} else if (!args.has("--write") && !args.has("--check")) {
  process.stdout.write(serialized);
}
