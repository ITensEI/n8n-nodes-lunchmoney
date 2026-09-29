# n8n-nodes-lunch-money

An [n8n](https://n8n.io/) community node for the [Lunch Money](https://lunchmoney.app/) personal finance API (v2).

Lunch Money is a personal finance and budgeting tool. This node lets you automate workflows against your Lunch Money data — syncing transactions, managing categories, tracking budgets, and more.

> **Note:** The Lunch Money v2 API is currently in alpha and subject to change.

---

## Features

- Full coverage of the v2 API — **62 live endpoints** across 10 resources
- **Mock server toggle** in credentials — test safely without touching real data
- Credential test built-in (calls `/me` to verify your token)
- All operations and parameters configurable through the n8n UI
- Daily, review-gated synchronization with the latest stable upstream OpenAPI specification

## Resources & Operations

| Resource | Operations |
|---|---|
| **User** | Get Current User, Get Summary, Get/Update Account Settings, Get/Update User Settings, Get/Update User Account Settings |
| **Category** | Get Many, Get, Create, Update, Delete |
| **Transaction** | Get Many, Get, Create, Update, Delete, Create Group, Delete Group, Split, Unsplit, Upload Attachment, Get Attachment, Delete Attachment |
| **Tag** | Get Many, Get, Create, Update, Delete |
| **Recurring Item** | Get Many, Get |
| **Budget** | Get Settings, Upsert, Remove |
| **Manual Account** | Get Many, Get, Create, Update, Delete |
| **Plaid Account** | Get Many, Get, Fetch Latest |
| **Crypto** | Get Many Manual, Get Manual, Create Manual, Update Manual, Delete Manual, Get Many Synced, Get Synced, Get Synced By Symbol, Refresh Synced, Get All (Legacy) |
| **Balance History** | Get All, Get/Update/Delete For Account, Delete Entry, Get/Update/Delete Crypto Synced, Update Deleted Details |

## Prerequisites

- A self-hosted n8n instance for GitHub or unverified npm installation
- A [Lunch Money](https://lunchmoney.app/) account
- A Lunch Money API access token — generate one from **Settings → Developers** in the Lunch Money app

## Installation

### Self-hosted n8n (Docker)

SSH or exec into your n8n container, then:

```bash
cd /home/node/.n8n/nodes   # create this dir if it doesn't exist
npm init -y                 # only needed on first install
npm install --legacy-peer-deps git+https://github.com/ITensEI/n8n-nodes-lunchmoney.git
```

Restart your n8n container. The **Lunch Money** node will appear in the node palette.

> `--legacy-peer-deps` is required if your n8n instance already has other community nodes with conflicting peer dependencies. It is safe to use.

### Upgrading

```bash
cd /home/node/.n8n/nodes
npm install --legacy-peer-deps git+https://github.com/ITensEI/n8n-nodes-lunchmoney.git
```

Then restart n8n.

### npm (after publication)

```bash
npm install --legacy-peer-deps n8n-nodes-lunch-money
```

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

The scheduled GitHub Actions workflow performs the same refresh and opens a pull request. It never commits to `main` or auto-merges. `overrides.json` is the reviewed adapter contract that preserves stable n8n operation names and curated fields while recording intentional differences between the OpenAPI request shape and the n8n UI. New or changed upstream operations remain subject to pull-request review and CI before release.

## License

MIT
