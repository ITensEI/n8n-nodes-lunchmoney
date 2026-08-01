#!/usr/bin/env node
// Pulls the current STABLE @lunch-money/v2-api-spec release, parses its OpenAPI
// YAML, and regenerates lm-endpoints.json + .spec-version. Replaces the old
// hand-maintained lm-endpoints.json as the source scripts/generate-node.js reads.
//
// "Stable" = a bare X.Y.Z version (no -preview.N or other prerelease suffix).
// The package's `latest` dist-tag is not reliable (it can lag genuinely stable
// releases by months), so this resolves the highest stable version directly
// from the full version list rather than trusting a dist-tag.

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const { execFileSync } = require('child_process');

const PACKAGE_NAME = '@lunch-money/v2-api-spec';
const REPO_ROOT = path.join(__dirname, '..');
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

function resolveLatestStableVersion() {
	const versions = JSON.parse(
		execFileSync('npm', ['view', PACKAGE_NAME, 'versions', '--json'], {
			encoding: 'utf8',
			shell: true,
		}),
	);
	const stable = versions.filter((v) => /^\d+\.\d+\.\d+$/.test(v));
	if (stable.length === 0) {
		throw new Error(`No stable (non-prerelease) version of ${PACKAGE_NAME} found on npm.`);
	}
	stable.sort((a, b) => {
		const [aMaj, aMin, aPatch] = a.split('.').map(Number);
		const [bMaj, bMin, bPatch] = b.split('.').map(Number);
		return aMaj - bMaj || aMin - bMin || aPatch - bPatch;
	});
	return stable[stable.length - 1];
}

function downloadSpecYaml(version) {
	const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-spec-'));
	execFileSync('npm', ['pack', `${PACKAGE_NAME}@${version}`, '--pack-destination', tmpDir], {
		encoding: 'utf8',
		shell: true,
	});
	const tarball = fs.readdirSync(tmpDir).find((f) => f.endsWith('.tgz'));
	// --force-local: without it, GNU tar on Windows misreads a "C:\..." path as a
	// "host:path" remote-tar spec because of the drive-letter colon.
	execFileSync(
		'tar',
		['--force-local', '-xzf', path.join(tmpDir, tarball), '-C', tmpDir],
		{ shell: true },
	);
	return path.join(tmpDir, 'package', 'lunch-money-api-v2.yaml');
}

function resolveRef(ref, root) {
	// Only local refs of the form "#/components/schemas/xyz" appear in this spec.
	const parts = ref.replace(/^#\//, '').split('/');
	let node = root;
	for (const part of parts) node = node[part];
	return node;
}

function resolveSchema(schema, root) {
	if (!schema) return schema;
	if (schema.$ref) return resolveSchema(resolveRef(schema.$ref, root), root);
	if (schema.allOf) {
		// Common OpenAPI pattern for attaching a local description/override to a
		// referenced schema (e.g. `currency: { allOf: [{ $ref: currencyEnum }],
		// description: ... }`). Flatten by merging resolved members in order,
		// then letting this node's own sibling keys win as the most specific layer.
		const merged = Object.assign({}, ...schema.allOf.map((s) => resolveSchema(s, root)));
		const { allOf, ...own } = schema;
		return Object.assign(merged, own);
	}
	return schema;
}

// oneOf/anyOf schemas (e.g. crypto balance: number | numeric string) don't map
// to a single n8n field type, so they're surfaced as 'unknown' for the caller
// to special-case, matching the convention already used by the current node.
function schemaType(schema) {
	if (schema.oneOf || schema.anyOf) return 'unknown';
	return schema.type || 'unknown';
}

function extractParams(operation, root) {
	return (operation.parameters || []).map((param) => {
		const schema = resolveSchema(param.schema, root) || {};
		const out = {
			name: param.name,
			in: param.in,
			required: !!param.required,
			type: schemaType(schema),
			description: param.description || '',
		};
		if (schema.format) out.format = schema.format;
		if (schema.enum) out.enum = schema.enum;
		if (schema.default !== undefined) out.default = schema.default;
		return out;
	});
}

function extractBodyProps(operation, root) {
	const content = operation.requestBody && operation.requestBody.content;
	const mediaSchema = content && content['application/json'] && content['application/json'].schema;
	const schema = resolveSchema(mediaSchema, root);
	if (!schema || !schema.properties) return [];

	const required = new Set(schema.required || []);
	return Object.entries(schema.properties).map(([name, propSchema]) => {
		const resolved = resolveSchema(propSchema, root);
		const out = {
			name,
			type: schemaType(resolved),
			required: required.has(name),
			description: resolved.description || '',
			nullable: !!resolved.nullable,
		};
		if (resolved.format) out.format = resolved.format;
		if (resolved.enum) out.enum = resolved.enum;
		// x-updatable: false marks fields the API accepts but ignores on update
		// (system-computed values tolerated in a full-object echo payload) —
		// load-bearing for deciding which body props become editable UI fields.
		if (resolved['x-updatable'] !== undefined) out.updatable = resolved['x-updatable'];
		return out;
	});
}

function extractEndpoints(spec) {
	const endpoints = [];
	for (const [urlPath, pathItem] of Object.entries(spec.paths || {})) {
		for (const method of HTTP_METHODS) {
			const operation = pathItem[method];
			if (!operation) continue;
			endpoints.push({
				path: urlPath,
				method: method.toUpperCase(),
				operationId: operation.operationId,
				tags: operation.tags || [],
				summary: operation.summary || '',
				params: extractParams(operation, spec),
				bodyProps: extractBodyProps(operation, spec),
			});
		}
	}
	return endpoints;
}

function groupByTag(endpoints) {
	const byTag = {};
	for (const endpoint of endpoints) {
		// Every endpoint in this spec carries exactly one tag; if that ever
		// changes, only the first tag is used for grouping.
		const tag = endpoint.tags[0] || 'untagged';
		(byTag[tag] = byTag[tag] || []).push(endpoint);
	}
	return byTag;
}

function main() {
	const version = resolveLatestStableVersion();
	const yamlPath = downloadSpecYaml(version);
	const spec = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

	const endpoints = extractEndpoints(spec);
	const byTag = groupByTag(endpoints);

	fs.writeFileSync(
		path.join(REPO_ROOT, 'lm-endpoints.json'),
		JSON.stringify({ byTag, endpoints }, null, 2) + '\n',
	);
	fs.writeFileSync(path.join(REPO_ROOT, '.spec-version'), version + '\n');

	console.log(`Fetched ${PACKAGE_NAME}@${version}`);
	console.log(`${endpoints.length} endpoints across ${Object.keys(byTag).length} tags`);
}

main();
