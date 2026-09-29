# n8n-nodes-lunch-money

An [n8n](https://n8n.io/) community node for the [Lunch Money](https://lunchmoney.app/) personal finance API (v2).

Lunch Money is a personal finance and budgeting tool. This node lets you automate workflows against your Lunch Money data — syncing transactions, managing categories, tracking budgets, and more.

> **Note:** The Lunch Money v2 API is currently in alpha and subject to change.

---

## Features

- Covers every endpoint in the latest stable Lunch Money v2 API spec
- **Mock server toggle** in credentials — test safely without touching real data
- Credential test built-in (calls `/me` to verify your token)
- All operations and parameters configurable through the n8n UI
- Daily, review-gated synchronization with the latest stable upstream OpenAPI specification

## Resources & Operations

Resources: User, Category, Transaction, Tag, Recurring Item, Budget, Manual Account, Plaid Account, Crypto, and Balance History.

The operations follow the upstream spec and change as it does, so they are not listed here. To see the current set, open the node's **Operation** dropdown in n8n, or read `lm-endpoints.json` (every endpoint in the synced spec) and `.spec-version` (the spec version it was generated from).

## Prerequisites

- A self-hosted n8n instance for GitHub or unverified npm installation
- A [Lunch Money](https://lunchmoney.app/) account
- A Lunch Money API access token — generate one from **Settings → Developers** in the Lunch Money app

## Installation

### From npm in the n8n UI (recommended)

On a self-hosted instance, as an Owner or Admin:

1. Go to **Settings > Community Nodes** and select **Install**.
2. Enter `n8n-nodes-lunch-money`, accept the community-node risk notice, and select **Install**.

The **Lunch Money** node then appears in the node palette.

**Updating:** when a new version is published, n8n shows an **Update** button on the package in **Settings > Community Nodes**. Select it to upgrade. To roll back, uninstall and reinstall with a specific version (`n8n-nodes-lunch-money@1.2.3`).

Versions follow semver: a release that removes an operation is a major bump, one that adds an operation is a minor bump, and anything else is a patch.

### From GitHub (Docker, without npm)

SSH or exec into your n8n container, then:

```bash
cd /home/node/.n8n/nodes   # create this dir if it doesn't exist
npm init -y                 # only needed on first install
npm install --legacy-peer-deps git+https://github.com/ITensEI/n8n-nodes-lunchmoney.git
```

Restart your n8n container. The **Lunch Money** node will appear in the node palette.

> `--legacy-peer-deps` is required if your n8n instance already has other community nodes with conflicting peer dependencies. It is safe to use.

To upgrade a GitHub install, uninstall and reinstall (npm treats a git dependency as already satisfied), then restart n8n:

```bash
cd /home/node/.n8n/nodes
npm uninstall n8n-nodes-lunch-money
npm install --legacy-peer-deps git+https://github.com/ITensEI/n8n-nodes-lunchmoney.git
```

To move from a GitHub install to the npm install, uninstall the GitHub copy, restart n8n, then install from **Settings > Community Nodes**. The package name is the same, so existing workflows and credentials should keep resolving; open one afterwards to confirm.

## Credentials

1. In n8n, go to **Credentials → New → Lunch Money API**
2. Enter your **API Token** (from Lunch Money → Settings → Developers)
3. Toggle **Use Mock Server** on if you want to test against the static mock server instead of your real data — the mock accepts any token of 11+ characters
4. Click **Test** to verify the connection

## API Reference

- **v2 API Docs:** https://alpha.lunchmoney.dev/v2/docs
- **Live base URL:** `https://api.lunchmoney.dev/v2`
- **Mock base URL:** `https://lm-v2-api-next-a7fabcab8e9a.herokuapp.com/v2/`
- **OpenAPI spec (npm):** [@lunch-money/v2-api-spec](https://www.npmjs.com/package/@lunch-money/v2-api-spec)

## Development

```bash
git clone https://github.com/ITensEI/n8n-nodes-lunchmoney.git
cd n8n-nodes-lunchmoney
npm install
npm run build    # tsc + copy icons to dist/
npm run dev      # watch mode
```

The node source is generated from `lm-endpoints.json`, which is extracted from the latest stable `@lunch-money/v2-api-spec` package. To refresh and regenerate it locally:

```bash
npm ci --ignore-scripts
node scripts/fetch-spec.js
npm run generate
npm run build
```

The scheduled GitHub Actions workflow performs the same refresh, bumps the package version, and opens a pull request. It never commits to `main` or auto-merges. `overrides.json` is the reviewed adapter contract that preserves stable n8n operation names and curated fields while recording intentional differences between the OpenAPI request shape and the n8n UI. New or changed upstream operations remain subject to pull-request review and CI before release.

## Releases

Publishing is automatic on merge; merging stays a human review step.

1. **Spec sync** (`.github/workflows/spec-sync.yml`) runs daily. When the upstream spec changes the node, it regenerates the code, runs lint, tests and a build, bumps `package.json` (major for removed operations, minor for added ones, patch otherwise), and opens a `spec-sync/<spec-version>` pull request.
2. **CI** (`.github/workflows/ci.yml`) runs on the pull request. Because the bot opens it with `GITHUB_TOKEN`, GitHub holds the run until a maintainer selects **Approve workflows to run** in the merge box. CI also fails any pull request that changes `nodes/`, `credentials/` or `dist/` without bumping the version. For a manual change, run `npm version patch|minor|major --no-git-tag-version` and commit it.
3. **Publish** (`.github/workflows/publish.yml`) runs when a merge to `main` changes `package.json`. If npm does not have that version yet, it re-runs lint, tests and the build, publishes with npm Trusted Publishing (provenance is attached automatically), and creates a `vX.Y.Z` GitHub release.

## License

MIT
