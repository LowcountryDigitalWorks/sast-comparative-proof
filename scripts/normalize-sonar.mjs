import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { normalizePath, proofIdForPath } from "./proof-map.mjs";

const [issuesPath, hotspotDirectory, outputPath] = process.argv.slice(2);
if (!issuesPath || !hotspotDirectory || !outputPath) {
  throw new Error(
    "usage: normalize-sonar.mjs ISSUES_JSON HOTSPOT_DIRECTORY OUTPUT_JSON",
  );
}

const projectKey = process.env.SONAR_PROJECT_KEY ?? "";
const issuesPayload = JSON.parse(await readFile(issuesPath, "utf8"));
const findings = [];

for (const issue of issuesPayload.issues ?? []) {
  const file = normalizePath(issue.component, projectKey);
  findings.push({
    proofId: proofIdForPath(file),
    kind: "issue",
    ruleId: issue.rule ?? null,
    category: issue.type ?? issue.impacts ?? null,
    severity: issue.severity ?? null,
    file,
    startLine: issue.textRange?.startLine ?? issue.line ?? null,
    endLine: issue.textRange?.endLine ?? issue.line ?? null,
    message: issue.message ?? null,
    dataflow: (issue.flows ?? []).flatMap((flow) =>
      (flow.locations ?? []).map((location) => ({
        file: normalizePath(location.component, projectKey),
        line: location.textRange?.startLine ?? null,
      })),
    ),
  });
}

const hotspotFiles = (await readdir(hotspotDirectory))
  .filter((name) => name.endsWith(".json"))
  .sort();
for (const name of hotspotFiles) {
  const hotspot = JSON.parse(
    await readFile(resolve(hotspotDirectory, name), "utf8"),
  );
  const file = normalizePath(
    hotspot.component?.key ?? hotspot.component,
    projectKey,
  );
  findings.push({
    proofId: proofIdForPath(file),
    kind: "security-hotspot",
    ruleId: hotspot.rule?.key ?? hotspot.ruleKey ?? null,
    category:
      hotspot.rule?.securityCategory ?? hotspot.securityCategory ?? null,
    severity: hotspot.vulnerabilityProbability ?? null,
    file,
    startLine: hotspot.textRange?.startLine ?? hotspot.line ?? null,
    endLine: hotspot.textRange?.endLine ?? hotspot.line ?? null,
    message: hotspot.message ?? hotspot.rule?.name ?? null,
    dataflow: [],
  });
}

findings.sort((left, right) =>
  `${left.file}:${left.startLine ?? 0}:${left.ruleId ?? ""}`.localeCompare(
    `${right.file}:${right.startLine ?? 0}:${right.ruleId ?? ""}`,
    "en",
  ),
);

const normalized = {
  scanner: "SonarQube Cloud OSS",
  scannerVersion: process.env.SONAR_SCANNER_VERSION ?? null,
  analysisId: process.env.SONAR_ANALYSIS_ID ?? null,
  scannedCommit: process.env.SCANNED_COMMIT ?? null,
  corpusManifestSha256: process.env.CORPUS_MANIFEST_SHA256 ?? null,
  findingCount: findings.length,
  findings,
};

await writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
