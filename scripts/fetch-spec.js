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
const { extractBodyProps, resolveSchema, schemaType } = require('./spec-fields');

const PACKAGE_NAME = '@lunch-money/v2-api-spec';
const REPO_ROOT = path.join(__dirname, '..');
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const overrides = JSON.parse(
	fs.readFileSync(path.join(REPO_ROOT, 'overrides.json'), 'utf8'),
);

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
	// Extract from inside the temporary directory so the archive argument has no
	// Windows drive-letter colon. This works with both bsdtar and GNU tar.
	execFileSync('tar', ['-xzf', tarball, '-C', tmpDir], {
		cwd: tmpDir,
		shell: true,
	});
	return path.join(tmpDir, 'package', 'lunch-money-api-v2.yaml');
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
				bodyProps: extractBodyProps(
					operation,
					spec,
					overrides.operations[operation.operationId],
				),
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
