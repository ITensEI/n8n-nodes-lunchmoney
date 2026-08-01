const fs = require('fs');
const path = require('path');

const { endpoints } = JSON.parse(
	fs.readFileSync(path.join(__dirname, '..', 'lm-endpoints.json'), 'utf8'),
);
const overrides = JSON.parse(
	fs.readFileSync(path.join(__dirname, '..', 'overrides.json'), 'utf8'),
);

const NODES_DIR = path.join(__dirname, '..', 'nodes', 'LunchMoney');
const DESC_DIR = path.join(NODES_DIR, 'descriptions');

fs.mkdirSync(DESC_DIR, { recursive: true });

// ── Resource → Operation → Endpoint mapping (derived from lm-endpoints.json + overrides.json) ──
//
// RESOURCE_MAP (operation identity: name/value/action/path/method) is fully
// spec-derived — that generalizes cleanly via tag→resource mapping and
// path+method matching (which also self-corrects stale `opId` references).
//
// FIELDS (per-field UI metadata) is loaded VERBATIM from overrides.json rather
// than auto-derived. The hand-written field lists turned out to be 56
// independent editorial decisions, several of which are wrong relative to the
// live spec (see the "Confirmed live bugs" section in the project's vault
// doc) — a general merge algorithm can't faithfully reproduce *and* fix wrong
// decisions at once. Divergence between an override's fields and the live
// spec's query/body params is instead computed and written to
// .field-divergence.json for the sync PR to surface, so real drift (like
// those bugs) stays visible without the generator silently rewriting
// hand-curated field lists. New spec operations with no override entry still
// get mechanically generated — there's nothing hand-written to get wrong yet.

const tagToResource = {};
for (const [resourceKey, resource] of Object.entries(overrides.resources)) {
	for (const tag of resource.tags) tagToResource[tag] = resourceKey;
}

const excludeOperationIds = new Set(overrides.excludeOperationIds);
const knownPathDerivedFields = new Set(overrides.knownPathDerivedFields);

function toTitleCase(snakeName) {
	return snakeName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Splits a camelCase operationId into words, e.g. "getAllCryptoManual" -> ['get','All','Crypto','Manual']
function splitCamelCase(id) {
	return id.match(/[A-Z]?[a-z0-9]+|[A-Z]+(?=[A-Z]|$)/g) || [id];
}

// Best-effort fallback for spec operations with no override entry yet.
// Flagged in .new-operations.json for review rather than trusted silently.
function deriveOperationDisplay(endpoint) {
	const words = splitCamelCase(endpoint.operationId);
	const name = words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(' ');
	const value = words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1))).join('');
	return { name, value, action: endpoint.summary || name };
}

function deriveFieldType(specField) {
	if (specField.enum) return 'options';
	if (specField.type === 'boolean') return 'boolean';
	if (specField.type === 'array' || specField.type === 'object') return 'json';
	return 'string';
}

function deriveField(specField) {
	const field = {
		name: specField.name,
		displayName: toTitleCase(specField.name),
		type: deriveFieldType(specField),
		desc: specField.description || '',
	};
	if (specField.enum) field.options = specField.enum;
	return field;
}

// Fields a spec-sync PR should actually validate against: query params and
// non-legacy body props. Path params are excluded — several are renamed for
// n8n-side disambiguation (e.g. {symbol} -> cryptoSymbol) by handler code this
// generator doesn't touch, so comparing them by name produces false positives.
function specFieldCandidates(endpoint) {
	return [
		...endpoint.params.filter((p) => p.in !== 'path'),
		...endpoint.bodyProps.filter((p) => p.updatable !== false),
	];
}

// overrides.json's `operations` key order reflects the original hand-picked
// operation ordering (e.g. Create, Delete, Get, Get Many, Update) — preserved
// here so the generated dropdown order (and its `default` value) doesn't
// silently reshuffle to spec/YAML declaration order.
const operationOrder = new Map(Object.keys(overrides.operations).map((opId, i) => [opId, i]));

const RESOURCE_MAP = {};
const FIELDS = {};
for (const [resourceKey, resource] of Object.entries(overrides.resources)) {
	RESOURCE_MAP[resourceKey] = { displayName: resource.displayName, operations: [] };
	FIELDS[resourceKey] = {};
	if (resource.idField) FIELDS[resourceKey]._idField = resource.idField;
}

const newOperations = [];
const fieldDivergence = [];

for (const endpoint of endpoints) {
	if (excludeOperationIds.has(endpoint.operationId)) continue;

	const tag = endpoint.tags[0];
	const resourceKey = tagToResource[tag];
	if (!resourceKey) {
		console.warn(
			`WARNING: tag "${tag}" (operationId=${endpoint.operationId}) has no resource mapping in overrides.json - skipped. Add it under "resources".`,
		);
		continue;
	}

	const override = overrides.operations[endpoint.operationId];
	let name, value, desc, action;
	if (override) {
		({ name, value, desc, action } = override);
	} else {
		({ name, value, action } = deriveOperationDisplay(endpoint));
		desc = endpoint.summary;
		newOperations.push({ resourceKey, operationId: endpoint.operationId, value, name, method: endpoint.method, path: endpoint.path });
	}

	RESOURCE_MAP[resourceKey].operations.push({
		name,
		value,
		opId: endpoint.operationId,
		method: endpoint.method,
		path: endpoint.path,
		desc,
		action,
	});

	if (override && override.fields) {
		FIELDS[resourceKey][value] = override.fields;

		const candidates = specFieldCandidates(endpoint);
		const overrideFieldNames = new Set(
			[...(override.fields.required || []), ...(override.fields.optional || [])].map((f) => f.name),
		);
		const missingFromOverride = candidates
			.filter((c) => !overrideFieldNames.has(c.name))
			.map((c) => c.name);
		const staleInOverride = [...overrideFieldNames].filter(
			(n) => !knownPathDerivedFields.has(n) && !candidates.some((c) => c.name === n),
		);
		if (missingFromOverride.length || staleInOverride.length) {
			fieldDivergence.push({ resourceKey, value, operationId: endpoint.operationId, missingFromOverride, staleInOverride });
		}
	} else if (!override) {
		// New operation, no hand-written fields to diverge from - derive from spec directly.
		const candidates = specFieldCandidates(endpoint);
		const required = candidates.filter((c) => c.required).map(deriveField);
		const optional = candidates.filter((c) => !c.required).map(deriveField);
		const fieldsEntry = {};
		if (required.length) fieldsEntry.required = required;
		if (optional.length) fieldsEntry.optional = optional;
		if (Object.keys(fieldsEntry).length) FIELDS[resourceKey][value] = fieldsEntry;
	}
}

// New operations (no entry in operationOrder) sort to the end, in the order encountered.
for (const resource of Object.values(RESOURCE_MAP)) {
	resource.operations.sort((a, b) => (operationOrder.get(a.opId) ?? Infinity) - (operationOrder.get(b.opId) ?? Infinity));
}

if (newOperations.length) {
	fs.writeFileSync(
		path.join(__dirname, '..', '.new-operations.json'),
		JSON.stringify(newOperations, null, '\t') + '\n',
	);
	console.log(`${newOperations.length} new operation(s) had no override - auto-derived, see .new-operations.json for review.\n`);
}
if (fieldDivergence.length) {
	fs.writeFileSync(
		path.join(__dirname, '..', '.field-divergence.json'),
		JSON.stringify(fieldDivergence, null, '\t') + '\n',
	);
	console.log(`${fieldDivergence.length} operation(s) have field divergence from the live spec, see .field-divergence.json for review.\n`);
}

// ── Code generators ──

function toFieldProp(field, resource, operations) {
	const prop = {
		displayName: field.displayName,
		name: field.name,
		// number → string: n8n always renders number fields as 0; use string for truly empty inputs
		type: field.type === 'options' ? 'options' : field.type === 'json' ? 'json' : field.type === 'number' ? 'string' : field.type,
		default: field.type === 'boolean' ? false : field.type === 'json' ? '[]' : '',
		description: field.desc,
		displayOptions: {
			show: {
				resource: [resource],
				operation: Array.isArray(operations) ? operations : [operations],
			},
		},
	};
	if (field.required) prop.required = true;
	if (field.placeholder) prop.placeholder = field.placeholder;
	if (field.type === 'options' && field.options) {
		prop.options = field.options.map(o => ({ name: o.charAt(0).toUpperCase() + o.slice(1).replace(/_/g, ' '), value: o }));
	}
	return prop;
}

function generateDescriptionFile(resourceKey) {
	const resource = RESOURCE_MAP[resourceKey];
	const fields = FIELDS[resourceKey] || {};
	const varBase = resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1);

	let code = `import type { INodeProperties } from 'n8n-workflow';\n\n`;

	// Operations array
	code += `export const ${resourceKey}Operations: INodeProperties[] = [\n`;
	code += `\t{\n`;
	code += `\t\tdisplayName: 'Operation',\n`;
	code += `\t\tname: 'operation',\n`;
	code += `\t\ttype: 'options',\n`;
	code += `\t\tnoDataExpression: true,\n`;
	code += `\t\tdisplayOptions: {\n`;
	code += `\t\t\tshow: {\n`;
	code += `\t\t\t\tresource: ['${resourceKey}'],\n`;
	code += `\t\t\t},\n`;
	code += `\t\t},\n`;
	code += `\t\toptions: [\n`;
	for (const op of resource.operations) {
		code += `\t\t\t{\n`;
		code += `\t\t\t\tname: '${op.name}',\n`;
		code += `\t\t\t\tvalue: '${op.value}',\n`;
		code += `\t\t\t\tdescription: '${op.desc.replace(/'/g, "\\'")}',\n`;
		code += `\t\t\t\taction: '${op.action.replace(/'/g, "\\'")}',\n`;
		code += `\t\t\t},\n`;
	}
	code += `\t\t],\n`;
	code += `\t\tdefault: '${resource.operations[0].value}',\n`;
	code += `\t},\n`;
	code += `];\n\n`;

	// Fields array
	code += `export const ${resourceKey}Fields: INodeProperties[] = [\n`;

	// ID field (if exists)
	if (fields._idField) {
		const idF = fields._idField;
		const prop = {
			displayName: idF.displayName,
			name: idF.name,
			type: 'string',
			required: true,
			default: '',
			description: `The ID of the ${resource.displayName.toLowerCase()}`,
			displayOptions: {
				show: {
					resource: [resourceKey],
					operation: idF.ops,
				},
			},
		};
		code += `\t${JSON.stringify(prop, null, '\t').replace(/\n/g, '\n\t')},\n`;
	}

	// Operation-specific fields
	for (const op of resource.operations) {
		const opFields = fields[op.value];
		if (!opFields) continue;

		// Required fields
		if (opFields.required) {
			for (const f of opFields.required) {
				const prop = toFieldProp({ ...f, required: true }, resourceKey, op.value);
				code += `\t${JSON.stringify(prop, null, '\t').replace(/\n/g, '\n\t')},\n`;
			}
		}

		// Optional fields (in additional fields collection)
		if (opFields.optional && opFields.optional.length > 0) {
			// Additional Fields collection
			const collection = {
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [resourceKey],
						operation: [op.value],
					},
				},
				options: opFields.optional.map(f => {
					const o = {
						displayName: f.displayName,
						name: f.name,
						type: f.type === 'options' ? 'options' : f.type === 'number' ? 'string' : f.type,
						default: f.type === 'boolean' ? false : '',
						description: f.desc,
					};
					if (f.placeholder) o.placeholder = f.placeholder;
					if (f.type === 'options' && f.options) {
						o.options = f.options.map(ov => ({
							name: ov.charAt(0).toUpperCase() + ov.slice(1).replace(/_/g, ' '),
							value: ov,
						}));
					}
					return o;
				}),
			};
			code += `\t${JSON.stringify(collection, null, '\t').replace(/\n/g, '\n\t')},\n`;
		}
	}

	code += `];\n`;

	const fileName = `${varBase}Description.ts`;
	fs.writeFileSync(path.join(DESC_DIR, fileName), code);
	console.log(`  Generated ${fileName}`);
	return { varBase, resourceKey };
}

function generateIndex(resources) {
	let code = '';
	for (const { varBase, resourceKey } of resources) {
		code += `export { ${resourceKey}Operations, ${resourceKey}Fields } from './${varBase}Description';\n`;
	}
	fs.writeFileSync(path.join(DESC_DIR, 'index.ts'), code);
	console.log('  Generated index.ts');
}

function generateMainNode(resources) {
	let imports = `import { NodeConnectionTypes } from 'n8n-workflow';\n`;
	imports += `import type {\n\tIExecuteFunctions,\n\tIDataObject,\n\tINodeExecutionData,\n\tINodeType,\n\tINodeTypeDescription,\n} from 'n8n-workflow';\n\n`;
	imports += `import {\n\tlunchMoneyApiRequest,\n\tvalidateDateFormat,\n\tvalidateAmount,\n\tvalidateCurrency,\n} from './GenericFunctions';\n\n`;

	// Import descriptions
	const importNames = [];
	for (const { resourceKey } of resources) {
		importNames.push(`${resourceKey}Operations`, `${resourceKey}Fields`);
	}
	imports += `import {\n\t${importNames.join(',\n\t')},\n} from './descriptions';\n\n`;

	// Resource options for the main resource selector
	const resourceOptions = resources.map(({ resourceKey }) => {
		const rm = RESOURCE_MAP[resourceKey];
		return `\t\t\t\t{ name: '${rm.displayName}', value: '${resourceKey}' },`;
	}).join('\n');

	// Properties spread
	const propsSpread = resources.map(({ resourceKey }) =>
		`\t\t\t...${resourceKey}Operations,\n\t\t\t...${resourceKey}Fields,`
	).join('\n');

	// Execute method - generate the routing logic
	let executeBody = '';
	for (const { resourceKey } of resources) {
		const rm = RESOURCE_MAP[resourceKey];
		executeBody += `\t\t\t\tif (resource === '${resourceKey}') {\n`;
		for (const op of rm.operations) {
			executeBody += generateOperationHandler(resourceKey, op);
		}
		executeBody += `\t\t\t\t}\n\n`;
	}

	const code = `${imports}export class LunchMoney implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lunch Money',
		name: 'lunchMoney',
		icon: 'file:lunchMoney.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Lunch Money personal finance API (v2)',
		defaults: {
			name: 'Lunch Money',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'lunchMoneyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
${resourceOptions}
				],
				default: 'transaction',
			},
${propsSpread}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

${executeBody}
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
`;

	fs.writeFileSync(path.join(NODES_DIR, 'LunchMoney.node.ts'), code);
	console.log('  Generated LunchMoney.node.ts');
}

function generateOperationHandler(resourceKey, op) {
	const fields = FIELDS[resourceKey] || {};
	const idField = fields._idField;
	let code = `\t\t\t\t\tif (operation === '${op.value}') {\n`;

	// Build the API path with substitutions
	let apiPath = op.path;
	let needsId = false;

	// Determine parameter gathering
	const opFields = fields[op.value] || {};
	const hasRequired = opFields.required && opFields.required.length > 0;
	const hasOptional = opFields.optional && opFields.optional.length > 0;

	// Handle ID substitution from the standard ID field
	if (idField && idField.ops.includes(op.value) && apiPath.includes('{id}')) {
		code += `\t\t\t\t\t\tconst id = this.getNodeParameter('${idField.name}', i) as number;\n`;
		apiPath = apiPath.replace('{id}', '${id}');
		needsId = true;
	}

	// Handle special path parameters
	if (apiPath.includes('{file_id}')) {
		code += `\t\t\t\t\t\tconst fileId = this.getNodeParameter('fileId', i) as number;\n`;
		apiPath = apiPath.replace('{file_id}', '${fileId}');
	}
	if (apiPath.includes('{transaction_id}')) {
		code += `\t\t\t\t\t\tconst txId = this.getNodeParameter('uploadTransactionId', i) as number;\n`;
		apiPath = apiPath.replace('{transaction_id}', '${txId}');
	}
	if (apiPath.includes('{account_type}')) {
		code += `\t\t\t\t\t\tconst accountType = this.getNodeParameter('account_type', i) as string;\n`;
		apiPath = apiPath.replace('{account_type}', '${accountType}');
	}
	if (apiPath.includes('{account_id}')) {
		code += `\t\t\t\t\t\tconst accountId = this.getNodeParameter('account_id', i) as number;\n`;
		apiPath = apiPath.replace('{account_id}', '${accountId}');
	}

	// Handle {symbol} in path
	if (apiPath.includes('{symbol}')) {
		const symbolParam = (op.value === 'getSyncedBySymbol') ? 'cryptoSymbol' : 'cryptoSyncedSymbol';
		code += `\t\t\t\t\t\tconst symbol = this.getNodeParameter('${symbolParam}', i) as string;\n`;
		apiPath = apiPath.replace('{symbol}', '${symbol}');
	}

	// Special cases for non-standard IDs
	if (op.value === 'deleteGroup') {
		code += `\t\t\t\t\t\tconst groupId = this.getNodeParameter('groupId', i) as number;\n`;
		apiPath = '/transactions/group/${groupId}';
	}
	if (op.value === 'deleteEntry') {
		code += `\t\t\t\t\t\tconst entryId = this.getNodeParameter('entryId', i) as number;\n`;
		apiPath = '/balance_history/entries/${entryId}';
	}
	// Balance history crypto synced operations use dedicated fields
	if (['getCryptoSynced', 'updateCryptoSynced', 'deleteCryptoSynced'].includes(op.value)) {
		code += `\t\t\t\t\t\tconst csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i) as number;\n`;
		code += `\t\t\t\t\t\tconst csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;\n`;
		apiPath = '/balance_history/crypto_synced/${csAccountId}/${csSymbol}';
	}
	if (op.value === 'updateDeletedDetails') {
		code += `\t\t\t\t\t\tconst delAccountId = this.getNodeParameter('deletedAccountId', i) as number;\n`;
		apiPath = '/balance_history/deleted/${delAccountId}/details';
	}

	// Array fields that must be converted from comma-separated strings to int arrays
	const ARRAY_INT_FIELDS = new Set(['ids', 'tag_ids', 'additional_tag_ids']);

	// Fields that are query params even on PUT/POST (e.g. update_balance on PUT /transactions/{id})
	const QS_ON_MUTATION = new Set(['update_balance']);

	// Build body for POST/PUT
	if (op.method === 'POST' || op.method === 'PUT') {
		// Some POST/PUT operations use query string for all params (e.g. POST /plaid_accounts/fetch)
		const allParamsAsQs = !!opFields._useQs;

		if (allParamsAsQs) {
			// All fields go to query string, no body
			code += `\t\t\t\t\t\tconst qs: IDataObject = {};\n`;
			if (hasRequired) {
				for (const f of opFields.required) {
					code += `\t\t\t\t\t\tqs.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
				}
			}
			if (hasOptional) {
				code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
				code += `\t\t\t\t\t\tfor (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }\n`;
				code += `\t\t\t\t\t\tObject.assign(qs, additionalFields);\n`;
			}
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, {}, qs);\n`;
		} else {
			code += `\t\t\t\t\t\tconst body: IDataObject = {};\n`;

			if (hasRequired) {
				for (const f of opFields.required) {
					if (f.type === 'json') {
						// JSON fields go directly into body under their API key
						const apiKey = f.name === 'child_transactions' ? 'child_transactions' : f.name;
						const varName = f.name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
						code += `\t\t\t\t\t\tconst ${varName}Raw = this.getNodeParameter('${f.name}', i) as string;\n`;
						code += `\t\t\t\t\t\ttry { body.${apiKey} = JSON.parse(${varName}Raw); } catch { throw new Error('Invalid JSON in "${f.displayName}"'); }\n`;
					} else if (ARRAY_INT_FIELDS.has(f.name)) {
						code += `\t\t\t\t\t\tconst ${f.name}Str = this.getNodeParameter('${f.name}', i) as string;\n`;
						code += `\t\t\t\t\t\tbody.${f.name} = ${f.name}Str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));\n`;
					} else {
						code += `\t\t\t\t\t\tbody.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
					}
				}
			}

			if (hasOptional) {
				code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
				// Parse JSON fields in additionalFields
				const jsonOptFields = opFields.optional.filter(f => f.type === 'json');
				for (const f of jsonOptFields) {
					code += `\t\t\t\t\t\tif (additionalFields.${f.name} && typeof additionalFields.${f.name} === 'string') {\n`;
					code += `\t\t\t\t\t\t\ttry { additionalFields.${f.name} = JSON.parse(additionalFields.${f.name} as string); } catch { throw new Error('Invalid JSON in "${f.displayName}"'); }\n`;
					code += `\t\t\t\t\t\t}\n`;
				}
				// Convert any comma-separated array fields in additionalFields
				const arrayOptFields = opFields.optional.filter(f => ARRAY_INT_FIELDS.has(f.name));
				for (const f of arrayOptFields) {
					code += `\t\t\t\t\t\tif (additionalFields.${f.name}) {\n`;
					code += `\t\t\t\t\t\t\tadditionalFields.${f.name} = (additionalFields.${f.name} as string).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));\n`;
					code += `\t\t\t\t\t\t}\n`;
				}
				// Hoist query-string-only fields out of body
				const qsOptFields = opFields.optional.filter(f => QS_ON_MUTATION.has(f.name));
				if (qsOptFields.length > 0) {
					code += `\t\t\t\t\t\tconst mutationQs: IDataObject = {};\n`;
					for (const f of qsOptFields) {
						code += `\t\t\t\t\t\tif (additionalFields.${f.name} !== undefined) { mutationQs.${f.name} = additionalFields.${f.name}; delete additionalFields.${f.name}; }\n`;
					}
				}
				// Strip empty-string values so unset optional fields are not sent
				code += `\t\t\t\t\t\tfor (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }\n`;
				code += `\t\t\t\t\t\tObject.assign(body, additionalFields);\n`;
			}

			// Wrap transactions in array for bulk create
			if (resourceKey === 'transaction' && op.value === 'create') {
				code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, { transactions: [body] });\n`;
			} else {
				const hasQsFields = hasOptional && (opFields.optional || []).some(f => QS_ON_MUTATION.has(f.name));
				if (hasQsFields) {
					code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, body, mutationQs);\n`;
				} else {
					code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, body);\n`;
				}
			}
		}
	} else if (op.method === 'GET') {
		if (hasRequired || hasOptional) {
			code += `\t\t\t\t\t\tconst qs: IDataObject = {};\n`;
			if (hasRequired) {
				for (const f of opFields.required) {
					code += `\t\t\t\t\t\tqs.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
				}
			}
			if (hasOptional) {
				code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
				code += `\t\t\t\t\t\tfor (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }\n`;
				code += `\t\t\t\t\t\tObject.assign(qs, additionalFields);\n`;
			}
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, {}, qs);\n`;
		} else {
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`);\n`;
		}
		// Unwrap array responses
		const dataKeys = {
			'getAllCategories': 'categories',
			'getAllTags': 'tags',
			'getAllManualAccounts': 'manual_accounts',
			'getAllPlaidAccounts': 'plaid_accounts',
			'getAllTransactions': 'transactions',
			'getAllCryptoManual': 'crypto',
			'getAllCryptoSynced': 'crypto',
			'getAllCryptocurrencies': 'crypto',
			'getAllRecurring': 'recurring_items',
		};
		if (dataKeys[op.opId]) {
			code += `\t\t\t\t\t\tresponseData = responseData.${dataKeys[op.opId]} || responseData;\n`;
		}
	} else if (op.method === 'DELETE') {
		if (hasRequired && !needsId) {
			if (opFields._useQs) {
				// DELETE with query string params (e.g. DELETE /budgets)
				code += `\t\t\t\t\t\tconst qs: IDataObject = {};\n`;
				for (const f of opFields.required) {
					code += `\t\t\t\t\t\tqs.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
				}
				code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, {}, qs);\n`;
			} else {
				// DELETE with request body
				code += `\t\t\t\t\t\tconst body: IDataObject = {};\n`;
				for (const f of opFields.required) {
					code += `\t\t\t\t\t\tbody.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
				}
				if (hasOptional) {
					code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
					code += `\t\t\t\t\t\tObject.assign(body, additionalFields);\n`;
				}
				code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, body);\n`;
			}
		} else if (hasOptional) {
			// DELETE with path ID + optional query params (e.g. DELETE /categories/{id}?force=true)
			code += `\t\t\t\t\t\tconst qs: IDataObject = {};\n`;
			code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
			code += `\t\t\t\t\t\tfor (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }\n`;
			code += `\t\t\t\t\t\tObject.assign(qs, additionalFields);\n`;
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, {}, qs);\n`;
		} else {
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`);\n`;
		}
	}

	code += `\t\t\t\t\t}\n\n`;
	return code;
}

function generateCodex() {
	const codex = {
		node: 'n8n-nodes-base.lunchMoney',
		nodeVersion: '1.0',
		codexVersion: '1.0',
		categories: ['Finance & Accounting'],
		resources: {
			primaryDocumentation: [
				{ url: 'https://alpha.lunchmoney.dev/v2/docs' },
			],
		},
		alias: ['lunch money', 'finance', 'budget', 'transactions', 'personal finance'],
	};

	fs.writeFileSync(
		path.join(NODES_DIR, 'LunchMoney.node.json'),
		JSON.stringify(codex, null, '\t') + '\n',
	);
	console.log('  Generated LunchMoney.node.json');
}

// ── Main ──

console.log('Generating n8n Lunch Money node...\n');

console.log('Description files:');
const generatedResources = Object.keys(RESOURCE_MAP).map(key => generateDescriptionFile(key));

console.log('\nIndex file:');
generateIndex(generatedResources);

console.log('\nMain node file:');
generateMainNode(generatedResources);

console.log('\nCodex file:');
generateCodex();

console.log('\nDone! Generated files for', Object.keys(RESOURCE_MAP).length, 'resources with',
	Object.values(RESOURCE_MAP).reduce((sum, r) => sum + r.operations.length, 0), 'operations.');
