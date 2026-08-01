#!/usr/bin/env node
// Builds a Markdown summary of what changed in this spec-sync run, for use as
// the sync PR's body. Run after fetch-spec.js and generate-node.js, so
// lm-endpoints.json is the new state and .new-operations.json /
// .field-divergence.json (if present) reflect it. Compares against the
// previously-committed lm-endpoints.json (HEAD) as the "before" state.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');

function readJson(p) {
	try {
		return JSON.parse(fs.readFileSync(p, 'utf8'));
	} catch {
		return null;
	}
}

function previousEndpoints() {
	try {
		const raw = execFileSync('git', ['show', 'HEAD:lm-endpoints.json'], {
			cwd: REPO_ROOT,
			encoding: 'utf8',
			shell: true,
		});
		return JSON.parse(raw).endpoints;
	} catch {
		return [];
	}
}

function fieldNames(list) {
	return list.map((f) => f.name).sort().join(',');
}

function diffEndpoints(oldEndpoints, newEndpoints) {
	const oldById = new Map(oldEndpoints.map((e) => [e.operationId, e]));
	const newById = new Map(newEndpoints.map((e) => [e.operationId, e]));

	const added = [...newById.keys()].filter((id) => !oldById.has(id));
	const removed = [...oldById.keys()].filter((id) => !newById.has(id));
	const changed = [];
	for (const [id, newEp] of newById) {
		const oldEp = oldById.get(id);
		if (!oldEp) continue;
		const paramsChanged = fieldNames(oldEp.params) !== fieldNames(newEp.params);
		const bodyChanged = fieldNames(oldEp.bodyProps) !== fieldNames(newEp.bodyProps);
		if (paramsChanged || bodyChanged) {
			changed.push({
				operationId: id,
				method: newEp.method,
				path: newEp.path,
				paramsBefore: oldEp.params.map((p) => p.name),
				paramsAfter: newEp.params.map((p) => p.name),
				bodyBefore: oldEp.bodyProps.map((p) => p.name),
				bodyAfter: newEp.bodyProps.map((p) => p.name),
			});
		}
	}
	return { added, removed, changed };
}

function main() {
	const specVersion = fs.readFileSync(path.join(REPO_ROOT, '.spec-version'), 'utf8').trim();
	const { endpoints } = readJson(path.join(REPO_ROOT, 'lm-endpoints.json'));
	const oldEndpoints = previousEndpoints();
	const { added, removed, changed } = diffEndpoints(oldEndpoints, endpoints);

	const newOperations = readJson(path.join(REPO_ROOT, '.new-operations.json')) || [];
	const fieldDivergence = readJson(path.join(REPO_ROOT, '.field-divergence.json')) || [];

	let md = `## Lunch Money v2 spec sync: \`${specVersion}\`\n\n`;
	md += `Automated. Generated node code is included in this PR, not just a change list — review before merging.\n\n`;

	if (added.length) {
		md += `### New spec endpoints (${added.length})\n\n`;
		for (const id of added) {
			const ep = endpoints.find((e) => e.operationId === id);
			const gen = newOperations.find((n) => n.operationId === id);
			md += gen
				? `- \`${ep.method} ${ep.path}\` (\`${id}\`) — auto-generated as **${gen.name}** under \`${gen.resourceKey}\`. Name/fields are best-effort; review before relying on it.\n`
				: `- \`${ep.method} ${ep.path}\` (\`${id}\`) — not wired to any resource. Add a tag mapping in \`overrides.json\` if it belongs in the node.\n`;
		}
		md += '\n';
	}

	if (removed.length) {
		md += `### Removed from spec (${removed.length})\n\n`;
		md += 'These operationIds no longer exist in the live spec. If a node operation still references one, it will fail against the live API.\n\n';
		for (const id of removed) md += `- \`${id}\`\n`;
		md += '\n';
	}

	if (changed.length) {
		md += `### Changed parameters on existing spec endpoints (${changed.length})\n\n`;
		for (const c of changed) {
			md += `- **${c.operationId}** (\`${c.method} ${c.path}\`)\n`;
			if (c.paramsBefore.join() !== c.paramsAfter.join()) {
				md += `  - params: \`${c.paramsBefore.join(', ') || '(none)'}\` → \`${c.paramsAfter.join(', ') || '(none)'}\`\n`;
			}
			if (c.bodyBefore.join() !== c.bodyAfter.join()) {
				md += `  - body: \`${c.bodyBefore.join(', ') || '(none)'}\` → \`${c.bodyAfter.join(', ') || '(none)'}\`\n`;
			}
		}
		md += '\n';
	}

	if (fieldDivergence.length) {
		md += `### Existing node operations with field drift from the live spec (${fieldDivergence.length})\n\n`;
		md += 'Hand-written `overrides.json` field entries that no longer match the live spec — not auto-fixed. Needs a manual `overrides.json` edit, and possibly a `generateOperationHandler` change if the request shape itself changed, not just a field name.\n\n';
		for (const d of fieldDivergence) {
			md += `- **${d.resourceKey}.${d.value}** (\`${d.operationId}\`)`;
			if (d.missingFromOverride.length) md += ` — spec has \`${d.missingFromOverride.join(', ')}\` not in the node`;
			if (d.staleInOverride.length) md += `${d.missingFromOverride.length ? ';' : ' —'} node has \`${d.staleInOverride.join(', ')}\` not in the spec`;
			md += '\n';
		}
		md += '\n';
	}

	if (!added.length && !removed.length && !changed.length && !fieldDivergence.length) {
		md += `No structural spec changes or field drift detected since the last sync.\n\n`;
	}

	fs.writeFileSync(path.join(REPO_ROOT, '.pr-body.md'), md);
	console.log(md);
}

main();
