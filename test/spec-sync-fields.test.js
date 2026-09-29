const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
	computeFieldDivergence,
	extractBodyProps,
	specFieldCandidates,
} = require('../scripts/spec-fields');
const { formatAddedEndpoint, releaseType } = require('../scripts/summarize-changes');
const { isGreater, touchesRelease } = require('../scripts/check-version-bump');

function generatedOperationBlock(operationName) {
	const generatedNodePath = path.join(
		__dirname,
		'..',
		'nodes',
		'LunchMoney',
		'LunchMoney.node.ts',
	);
	const generatedNode = fs.readFileSync(generatedNodePath, 'utf8');
	const startMarker = `if (operation === '${operationName}') {`;
	const start = generatedNode.indexOf(startMarker);
	assert.notEqual(start, -1, `Missing generated operation ${operationName}`);

	const nextOperation = generatedNode.indexOf("if (operation === '", start + startMarker.length);
	return generatedNode.slice(start, nextOperation === -1 ? undefined : nextOperation);
}

function buildSpec() {
	return {
		components: {
			schemas: {
				TransactionInsert: {
					type: 'object',
					required: ['date', 'amount'],
					properties: {
						date: { type: 'string' },
						amount: { type: 'string' },
						original_name: { type: 'string' },
					},
				},
			},
		},
	};
}

test('extractBodyProps preserves only adapter-requested array item fields', () => {
	const spec = buildSpec();
	const operation = {
		requestBody: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						required: ['transactions'],
						properties: {
							transactions: {
								type: 'array',
								items: { $ref: '#/components/schemas/TransactionInsert' },
							},
							apply_rules: { type: 'boolean' },
						},
					},
				},
			},
		},
	};

	const unadaptedBodyProps = extractBodyProps(operation, spec);
	assert.equal(unadaptedBodyProps[0].itemProps, undefined);

	const bodyProps = extractBodyProps(operation, spec, {
		bodyAdapter: { arrayField: 'transactions' },
	});

	assert.deepEqual(
		bodyProps.map((field) => field.name),
		['transactions', 'apply_rules'],
	);
	assert.deepEqual(
		bodyProps[0].itemProps.map((field) => ({ name: field.name, required: field.required })),
		[
			{ name: 'date', required: true },
			{ name: 'amount', required: true },
			{ name: 'original_name', required: false },
		],
	);
});

test('extractBodyProps reads multipart form fields when no JSON body exists', () => {
	const spec = buildSpec();
	const operation = {
		requestBody: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						required: ['file'],
						properties: {
							file: { type: 'string', format: 'binary' },
							notes: { type: 'string' },
						},
					},
				},
			},
		},
	};

	const bodyProps = extractBodyProps(operation, spec);

	assert.deepEqual(
		bodyProps.map((field) => ({ name: field.name, required: field.required, format: field.format })),
		[
			{ name: 'file', required: true, format: 'binary' },
			{ name: 'notes', required: false, format: undefined },
		],
	);
});

test('body-array adapters compare node fields with array items and envelope options', () => {
	const endpoint = {
		params: [],
		bodyProps: [
			{
				name: 'transactions',
				type: 'array',
				required: true,
				itemProps: [
					{ name: 'date', type: 'string', required: true },
					{ name: 'amount', type: 'string', required: true },
				],
			},
			{ name: 'apply_rules', type: 'boolean', required: false },
		],
	};
	const operationOverride = {
		bodyAdapter: { arrayField: 'transactions' },
		fields: {
			required: [{ name: 'date' }, { name: 'amount' }],
			optional: [{ name: 'apply_rules' }],
		},
	};

	assert.deepEqual(
		specFieldCandidates(endpoint, operationOverride).map((field) => field.name),
		['date', 'amount', 'apply_rules'],
	);
	assert.equal(computeFieldDivergence(endpoint, operationOverride, new Set()), null);

	endpoint.bodyProps[0].itemProps.push({
		name: 'custom_metadata',
		type: 'object',
		required: false,
	});

	assert.deepEqual(computeFieldDivergence(endpoint, operationOverride, new Set()), {
		missingFromOverride: ['custom_metadata'],
		staleInOverride: [],
	});
});

test('field aliases and operation-specific handler fields suppress only reviewed adapters', () => {
	const endpoint = {
		params: [{ name: 'transaction_id', in: 'path', required: true, type: 'integer' }],
		bodyProps: [
			{ name: 'file', type: 'string', required: true },
			{ name: 'notes', type: 'string', required: false },
		],
	};
	const operationOverride = {
		bodyAdapter: {
			fieldAliases: {
				file: 'binaryPropertyName',
			},
		},
		fields: {
			required: [{ name: 'uploadTransactionId' }, { name: 'binaryPropertyName' }],
			optional: [{ name: 'notes' }],
		},
	};

	assert.equal(
		computeFieldDivergence(endpoint, operationOverride, new Set(['uploadTransactionId'])),
		null,
	);
	assert.deepEqual(computeFieldDivergence(endpoint, operationOverride, new Set()), {
		missingFromOverride: [],
		staleInOverride: ['uploadTransactionId'],
	});
});

test('special balance-history paths do not read hidden generic path parameters', () => {
	for (const operationName of [
		'getCryptoSynced',
		'updateCryptoSynced',
		'deleteCryptoSynced',
	]) {
		const operationBlock = generatedOperationBlock(operationName);
		assert.doesNotMatch(operationBlock, /getNodeParameter\('account_id'/);
		assert.doesNotMatch(operationBlock, /getNodeParameter\('cryptoSyncedSymbol'.*\n.*getNodeParameter\('cryptoSyncedSymbol'/s);
	}

	const deletedDetailsBlock = generatedOperationBlock('updateDeletedDetails');
	assert.doesNotMatch(deletedDetailsBlock, /getNodeParameter\('account_id'/);
	assert.match(deletedDetailsBlock, /getNodeParameter\('deletedAccountId'/);
});

test('added endpoints with reviewed overrides are reported as wired', () => {
	const endpoint = {
		method: 'PUT',
		path: '/me/account/settings',
		operationId: 'updateAccountSettings',
	};
	const operationOverride = {
		resource: 'user',
		name: 'Update Account Settings',
		fieldsFromSpec: true,
	};

	const summaryLine = formatAddedEndpoint(endpoint, undefined, operationOverride);

	assert.match(summaryLine, /reviewed override/);
	assert.match(summaryLine, /fields remain spec-derived/);
	assert.doesNotMatch(summaryLine, /not wired/);
});

test('sync release type follows the operation-level change', () => {
	assert.equal(releaseType({ added: [], removed: ['getThing'] }), 'major');
	assert.equal(releaseType({ added: ['newThing'], removed: ['getThing'] }), 'major');
	assert.equal(releaseType({ added: ['newThing'], removed: [] }), 'minor');
	assert.equal(releaseType({ added: [], removed: [] }), 'patch');
});

test('version bump check compares numeric semver and scopes to published paths', () => {
	assert.equal(isGreater('0.1.1', '0.1.0'), true);
	assert.equal(isGreater('0.10.0', '0.9.9'), true);
	assert.equal(isGreater('1.0.0', '0.99.99'), true);
	assert.equal(isGreater('0.1.0', '0.1.0'), false);
	assert.equal(isGreater('0.1.0', '0.2.0'), false);
	assert.deepEqual(
		touchesRelease(['README.md', 'dist/nodes/LunchMoney/LunchMoney.node.js', 'scripts/x.js']),
		['dist/nodes/LunchMoney/LunchMoney.node.js'],
	);
});
