import { readFile } from "node:fs/promises";

import { normalizePath, proofIdForPath } from "./proof-map.mjs";

const [rawPath, outputPath] = process.argv.slice(2);
if (!rawPath || !outputPath)
  throw new Error("usage: normalize-snyk.mjs RAW_JSON OUTPUT_JSON");

const raw = JSON.parse(await readFile(rawPath, "utf8"));
const findings = [];

for (const run of raw.runs ?? []) {
  const rules = run.tool?.driver?.rules ?? [];
  for (const result of run.results ?? []) {
    const primary = result.locations?.[0]?.physicalLocation;
    const file = normalizePath(primary?.artifactLocation?.uri);
    const rule = Number.isInteger(result.ruleIndex)
      ? rules[result.ruleIndex]
      : undefined;
    const dataflow = (result.codeFlows ?? []).flatMap((flow) =>
      (flow.threadFlows ?? []).flatMap((thread) =>
        (thread.locations ?? []).map(({ location }) => ({
          file: normalizePath(
            location?.physicalLocation?.artifactLocation?.uri,
          ),
          line: location?.physicalLocation?.region?.startLine ?? null,
        })),
      ),
    );

    findings.push({
      proofId: proofIdForPath(file),
      ruleId: result.ruleId ?? rule?.id ?? null,
      vulnerabilityType:
        rule?.shortDescription?.text ?? rule?.name ?? result.ruleId ?? null,
      severity: result.level ?? null,
      file,
      startLine: primary?.region?.startLine ?? null,
      endLine: primary?.region?.endLine ?? null,
      message: result.message?.text ?? null,
      dataflow,
    });
  }
}

for (const vulnerability of raw.vulnerabilities ?? []) {
  const file = normalizePath(vulnerability.filePath ?? vulnerability.path);
  findings.push({
    proofId: proofIdForPath(file),
    ruleId: vulnerability.id ?? null,
    vulnerabilityType: vulnerability.title ?? vulnerability.type ?? null,
    severity: vulnerability.severity ?? null,
    file,
    startLine: vulnerability.lineNumber ?? vulnerability.line ?? null,
    endLine: vulnerability.lineNumber ?? vulnerability.line ?? null,
    message: vulnerability.message ?? vulnerability.title ?? null,
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
  scanner: "Snyk Code Free",
  cliVersion: process.env.SNYK_CLI_VERSION ?? null,
  scannedCommit: process.env.SCANNED_COMMIT ?? null,
  corpusManifestSha256: process.env.CORPUS_MANIFEST_SHA256 ?? null,
  findingCount: findings.length,
  findings,
};

await import("node:fs/promises").then(({ writeFile }) =>
  writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8"),
);
