const assert = require('node:assert/strict');
const test = require('node:test');

const { LunchMoney } = require('../dist/nodes/LunchMoney/LunchMoney.node.js');

const TRANSACTION_PAGE_SIZE = 2000;

function createExecutionContext({ parameters, responses }) {
	const requests = [];
	const queuedResponses = [...responses];

	const context = {
		continueOnFail: () => false,
		getCredentials: async () => ({ useMockServer: false }),
		getInputData: () => [{ json: {} }],
		getNode: () => ({ name: 'Lunch Money' }),
		getNodeParameter(name) {
			if (!(name in parameters)) {
				throw new Error(`Missing test parameter: ${name}`);
			}
			return parameters[name];
		},
		helpers: {
			constructExecutionMetaData(items, { itemData }) {
				return items.map((item) => ({ ...item, pairedItem: itemData.item }));
			},
			async requestWithAuthentication(_credentialName, options) {
				requests.push({
					method: options.method,
					uri: options.uri,
					qs: { ...options.qs },
				});

				if (queuedResponses.length === 0) {
					throw new Error('The node made more requests than the test provided responses for');
				}

				return queuedResponses.shift();
			},
			returnJsonArray(data) {
				const values = Array.isArray(data) ? data : [data];
				return values.map((json) => ({ json }));
			},
		},
	};

	return { context, requests };
}

async function executeGetMany({ returnAll, limit = 1000, additionalFields = {}, responses }) {
	const { context, requests } = createExecutionContext({
		parameters: {
			resource: 'transaction',
			operation: 'getAll',
			returnAll,
			limit,
			additionalFields,
		},
		responses,
	});

	const [items] = await new LunchMoney().execute.call(context);
	return { items, requests };
}

test('Transaction Get Many exposes Return All and a spec-bounded Limit field', () => {
	const properties = new LunchMoney().description.properties;
	const returnAll = properties.find((property) => property.name === 'returnAll');
	const limit = properties.find((property) => property.name === 'limit');

	assert.deepEqual(returnAll, {
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll'],
			},
		},
	});
	assert.deepEqual(limit, {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 1000,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: TRANSACTION_PAGE_SIZE,
		},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	});

	const additionalFields = properties.find(
		(property) =>
			property.name === 'additionalFields' &&
			property.displayOptions?.show?.resource?.includes('transaction') &&
			property.displayOptions?.show?.operation?.includes('getAll'),
	);
	assert.ok(additionalFields);
	assert.equal(additionalFields.options.some((option) => option.name === 'limit'), false);
	assert.equal(additionalFields.options.some((option) => option.name === 'offset'), false);
});

test('Return All follows has_more, advances offsets, and preserves every user query', async () => {
	const additionalFields = {
		start_date: '2026-01-01',
		end_date: '2026-01-31',
		category_id: '42',
		include_metadata: true,
		include_pending: false,
	};
	const { items, requests } = await executeGetMany({
		returnAll: true,
		additionalFields,
		responses: [
			{ transactions: [{ id: 1 }, { id: 2 }], has_more: true },
			{ transactions: [{ id: 3 }], has_more: true },
			{ transactions: [{ id: 4 }], has_more: false },
		],
	});

	assert.deepEqual(
		items.map((item) => item.json.id),
		[1, 2, 3, 4],
	);
	assert.deepEqual(
		requests.map((request) => request.qs.offset),
		[0, TRANSACTION_PAGE_SIZE, TRANSACTION_PAGE_SIZE * 2],
	);
	for (const request of requests) {
		assert.deepEqual(request.qs, {
			...additionalFields,
			limit: TRANSACTION_PAGE_SIZE,
			offset: request.qs.offset,
		});
	}
});

test('Return All stops after one page when has_more is false', async () => {
	const { items, requests } = await executeGetMany({
		returnAll: true,
		additionalFields: { updated_since: '2026-02-01' },
		responses: [{ transactions: [{ id: 10 }], has_more: false }],
	});

	assert.deepEqual(items.map((item) => item.json.id), [10]);
	assert.equal(requests.length, 1);
	assert.deepEqual(requests[0].qs, {
		updated_since: '2026-02-01',
		limit: TRANSACTION_PAGE_SIZE,
		offset: 0,
	});
});

test('Limit mode makes one request with the selected limit', async () => {
	const { items, requests } = await executeGetMany({
		returnAll: false,
		limit: 37,
		additionalFields: { include_files: true, status: 'reviewed' },
		responses: [{ transactions: [{ id: 20 }], has_more: true }],
	});

	assert.deepEqual(items.map((item) => item.json.id), [20]);
	assert.equal(requests.length, 1);
	assert.deepEqual(requests[0].qs, {
		include_files: true,
		status: 'reviewed',
		limit: 37,
	});
});
