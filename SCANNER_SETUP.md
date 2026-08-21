# Phase 1 scanner account boundary

The workflow does not install or authorize a GitHub App and does not import or bind this GitHub
repository. Use vendor CLI/token setup only. Do not grant either vendor access to the LDW GitHub
organization or any product repository.

## SonarQube Cloud OSS

1. In SonarQube Cloud, manually create an unbound public/OSS project for this synthetic proof.
   Do not choose GitHub import, install a GitHub App, or authorize organization access.
2. Record the project's organization key, project key, and regional service base URL exactly as
   shown by SonarQube Cloud.
3. Create the minimum analysis token for that project/account. Do not paste it into source,
   issues, PRs, comments, logs, or prompts.
4. In GitHub repository **Settings > Secrets and variables > Actions**, create the repository
   secret `SONAR_TOKEN`.
5. In the same area, create repository variables `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY`, and
   `SONAR_HOST_URL`. The host URL must be the exact HTTPS base URL for the project's region.

The manual workflow stops before analysis if any name/configuration is missing. It uses the
official `@sonar/scan` package pinned in `package-lock.json`, then reads issue and security-hotspot
evidence with the same token through the configured regional API.

## Snyk Code Free

1. Create or use a Snyk account that permits Snyk Code Free CLI analysis.
2. Generate/copy the CLI authentication token without enabling SCM integration or granting
   GitHub organization/repository access.
3. In GitHub repository **Settings > Secrets and variables > Actions**, create the repository
   secret `SNYK_TOKEN`.

The workflow downloads the exact official Snyk CLI version and verifies its vendor-published
SHA-256 before use. It treats exit code `1` as valid finding evidence. It does not use `--report`,
upload SARIF, or create a Snyk SCM project.

## Removal

Delete the repository secrets and Sonar variables in GitHub, revoke the vendor tokens in their
respective account consoles, and delete the manually created Sonar project. No GitHub App or OAuth
grant should exist to remove.
