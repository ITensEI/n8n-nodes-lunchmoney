#!/usr/bin/env node
// Fails a pull request that changes the published node without bumping the
// package version. Every merge that changes shipped code must carry a new
// version, because publish.yml only publishes versions npm does not have yet.
//
// Usage: node scripts/check-version-bump.js <base-ref>   (e.g. origin/main)

const { execFileSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
// Paths whose contents end up in the published package or change its behavior.
const RELEASE_PATHS = ['nodes/', 'credentials/', 'dist/'];

function git(args) {
	return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
}

function parseVersion(version) {
	const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
	if (!match) throw new Error(`Unrecognized version "${version}"`);
	return match.slice(1).map(Number);
}

function isGreater(head, base) {
	const a = parseVersion(head);
	const b = parseVersion(base);
	for (let i = 0; i < 3; i++) {
		if (a[i] !== b[i]) return a[i] > b[i];
	}
	return false;
}

function touchesRelease(files) {
	return files.filter((file) => RELEASE_PATHS.some((prefix) => file.startsWith(prefix)));
}

function main() {
	const baseRef = process.argv[2];
	if (!baseRef) throw new Error('Usage: check-version-bump.js <base-ref>');

	const changed = git(['diff', '--name-only', `${baseRef}...HEAD`]).split('\n').filter(Boolean);
	const releaseFiles = touchesRelease(changed);
	if (!releaseFiles.length) {
		console.log('No published files changed; no version bump required.');
		return;
	}

	const baseVersion = JSON.parse(git(['show', `${baseRef}:package.json`])).version;
	const headVersion = require(path.join(REPO_ROOT, 'package.json')).version;
	if (!isGreater(headVersion, baseVersion)) {
		console.error(
			`Published files changed (${releaseFiles.length}, e.g. ${releaseFiles[0]}) but package.json ` +
				`version ${headVersion} is not greater than ${baseVersion} on ${baseRef}. ` +
				'Run `npm version patch|minor|major --no-git-tag-version` and commit the result.',
		);
		process.exit(1);
	}
	console.log(`Version bumped ${baseVersion} -> ${headVersion}.`);
}

if (require.main === module) {
	main();
}

module.exports = { isGreater, touchesRelease };
