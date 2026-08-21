# Repository-local security baseline record

Recorded before changes on 2026-08-20 (America/New_York).

## Current state recorded before change

- Public repository; `main` commit `1c5724623ac358d14e45336b069b4d0d2aaf1907`, tree
  `fc5fe33fb29b33113a09afa49f55dfde48d6dca7`; only `README.md` existed.
- Blank description; merge commits, squash merges, and rebase merges enabled; merged branches
  retained; wiki and projects enabled; issues enabled; discussions and Pages disabled.
- No pull requests, rulesets, branch protection, environments, deployments, releases, forks,
  repository webhooks, repository secrets, or repository variables.
- GitHub Actions enabled with repository policy `all`; default `GITHUB_TOKEN` permissions were
  read-only and Actions could not approve pull requests.
- Secret scanning and repository push protection disabled. CodeQL default setup `not-configured`;
  no code-scanning analyses.
- Effective repository ruleset query including parents returned none. Organization Actions and
  organization-ruleset administration endpoints were permission-gated to the inspecting token;
  no organization setting was changed or loosened.

## Proposed and applied state

- Remain public with a description identifying synthetic, intentionally vulnerable test evidence.
- Squash merge only; automatic deletion of merged head branches; wiki/projects disabled; issues
  retained; Pages/discussions remain disabled.
- Preserve read-only workflow-token permissions and prohibition on Actions approving PRs.
- Enable only the $0 public-repository secret scanning and push protection controls. Do not enable
  CodeQL/default setup or a paid GitHub security service.
- Active repository-local ruleset `21124887` for `main`: prohibit deletion/non-fast-forward
  updates, require linear history, require pull requests and resolved review conversations, allow
  squash only, no bypass actors, and no required status checks.

## Rollback

- Restore blank description; enable merge commits/rebase merges; retain squash; stop automatic
  merged-branch deletion; re-enable wiki/projects.
- Disable repository secret scanning and repository push protection.
- Delete repository ruleset `21124887`.
- Preserve public visibility, issues, disabled Pages/discussions, read-only workflow token, and
  prohibition on Actions approving PRs.

Rollback affects only this synthetic proof repository and requires repository-admin authority.
