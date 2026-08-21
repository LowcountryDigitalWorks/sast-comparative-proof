# Synthetic comparative SAST proof

This public repository contains intentionally vulnerable, synthetic-only test code for a
bounded comparison of SonarQube Cloud OSS and Snyk Code Free against known Hono and
Cloudflare D1 static-analysis blind spots.

It is not production software, a deployable application, a reusable scanner product, or an
accepted Lowcountry Digital Works security control. Nothing here processes customer data,
PHI, CUI, credentials, or production traffic. The inert Node server objects never call
`listen()`, and the Hono applications are not exported through a deployment entry point.

Historical CodeQL evidence is authoritative and is not rerun by this repository. Scanner
success is limited to the intended source-to-sink canaries documented in [CORPUS.md](CORPUS.md);
unrelated dependency, secret, style, lint, and code-smell findings do not count.

## Local validation

Use Node.js 24 and the exact committed lockfile:

```text
npm ci
npm run validate
```

`npm run validate` checks formatting, strict TypeScript compilation, the deterministic corpus
manifest, and proof-ID placement. It does not execute a cloud scanner.

## Scanner execution boundary

The proof workflow is manual-only and restricted to an accepted `main` commit. It uses vendor
tokens only from GitHub Actions secrets, writes raw scanner results only under `RUNNER_TEMP`,
and prints normalized evidence without source snippets. It does not upload SARIF, create PR
comments, create deployments, modify repository settings, or establish a required check.

See [SCANNER_SETUP.md](SCANNER_SETUP.md) for the separately controlled vendor-account setup.
