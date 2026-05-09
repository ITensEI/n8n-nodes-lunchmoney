import { NodeConnectionTypes } from 'n8n-workflow';
import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	lunchMoneyApiRequest,
	validateDateFormat,
	validateAmount,
	validateCurrency,
} from './GenericFunctions';

import {
	userOperations,
	userFields,
	categoryOperations,
	categoryFields,
	transactionOperations,
	transactionFields,
	tagOperations,
	tagFields,
	recurringItemOperations,
	recurringItemFields,
	budgetOperations,
	budgetFields,
	manualAccountOperations,
	manualAccountFields,
	plaidAccountOperations,
	plaidAccountFields,
	cryptoOperations,
	cryptoFields,
	balanceHistoryOperations,
	balanceHistoryFields,
} from './descriptions';

export class LunchMoney implements INodeType {
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
				{ name: 'User', value: 'user' },
				{ name: 'Category', value: 'category' },
				{ name: 'Transaction', value: 'transaction' },
				{ name: 'Tag', value: 'tag' },
				{ name: 'Recurring Item', value: 'recurringItem' },
				{ name: 'Budget', value: 'budget' },
				{ name: 'Manual Account', value: 'manualAccount' },
				{ name: 'Plaid Account', value: 'plaidAccount' },
				{ name: 'Crypto', value: 'crypto' },
				{ name: 'Balance History', value: 'balanceHistory' },
				],
				default: 'transaction',
			},
			...userOperations,
			...userFields,
			...categoryOperations,
			...categoryFields,
			...transactionOperations,
			...transactionFields,
			...tagOperations,
			...tagFields,
			...recurringItemOperations,
			...recurringItemFields,
			...budgetOperations,
			...budgetFields,
			...manualAccountOperations,
			...manualAccountFields,
			...plaidAccountOperations,
			...plaidAccountFields,
			...cryptoOperations,
			...cryptoFields,
			...balanceHistoryOperations,
			...balanceHistoryFields,
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

				if (resource === 'user') {
					if (operation === 'get') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/me`);
					}

					if (operation === 'getSummary') {
						const qs: IDataObject = {};
						qs.start_date = this.getNodeParameter('start_date', i);
						qs.end_date = this.getNodeParameter('end_date', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/summary`, {}, qs);
					}

				}

				if (resource === 'category') {
					if (operation === 'create') {
						const body: IDataObject = {};
						body.name = this.getNodeParameter('name', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.children && typeof additionalFields.children === 'string') {
							try { additionalFields.children = JSON.parse(additionalFields.children as string); } catch { throw new Error('Invalid JSON in "Children (JSON)"'); }
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/categories`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('categoryId', i) as number;
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/categories/${id}`, {}, qs);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('categoryId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/categories/${id}`);
					}

					if (operation === 'getAll') {
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/categories`, {}, qs);
						responseData = responseData.categories || responseData;
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('categoryId', i) as number;
						const body: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.children && typeof additionalFields.children === 'string') {
							try { additionalFields.children = JSON.parse(additionalFields.children as string); } catch { throw new Error('Invalid JSON in "Children (JSON)"'); }
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/categories/${id}`, body);
					}

				}

				if (resource === 'transaction') {
					if (operation === 'create') {
						const body: IDataObject = {};
						body.date = this.getNodeParameter('date', i);
						body.amount = this.getNodeParameter('amount', i);
						body.payee = this.getNodeParameter('payee', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.tag_ids) {
							additionalFields.tag_ids = (additionalFields.tag_ids as string).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/transactions`, { transactions: [body] });
					}

					if (operation === 'createGroup') {
						const body: IDataObject = {};
						body.date = this.getNodeParameter('date', i);
						body.payee = this.getNodeParameter('payee', i);
						const idsStr = this.getNodeParameter('ids', i) as string;
						body.ids = idsStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.tag_ids) {
							additionalFields.tag_ids = (additionalFields.tag_ids as string).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/transactions/group`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('transactionId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/${id}`);
					}

					if (operation === 'deleteAttachment') {
						const fileId = this.getNodeParameter('fileId', i) as number;
						const body: IDataObject = {};
						body.fileId = this.getNodeParameter('fileId', i);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/attachments/${fileId}`, body);
					}

					if (operation === 'deleteGroup') {
						const groupId = this.getNodeParameter('groupId', i) as number;
						const body: IDataObject = {};
						body.groupId = this.getNodeParameter('groupId', i);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/group/${groupId}`, body);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('transactionId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/transactions/${id}`);
					}

					if (operation === 'getAttachment') {
						const fileId = this.getNodeParameter('fileId', i) as number;
						const qs: IDataObject = {};
						qs.fileId = this.getNodeParameter('fileId', i);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/transactions/attachments/${fileId}`, {}, qs);
					}

					if (operation === 'getAll') {
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/transactions`, {}, qs);
						responseData = responseData.transactions || responseData;
					}

					if (operation === 'split') {
						const id = this.getNodeParameter('transactionId', i) as number;
						const body: IDataObject = {};
						const childTransactionsRaw = this.getNodeParameter('child_transactions', i) as string;
						try { body.child_transactions = JSON.parse(childTransactionsRaw); } catch { throw new Error('Invalid JSON in "Child Transactions (JSON)"'); }
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/transactions/split/${id}`, body);
					}

					if (operation === 'unsplit') {
						const id = this.getNodeParameter('transactionId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/split/${id}`);
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('transactionId', i) as number;
						const body: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.custom_metadata && typeof additionalFields.custom_metadata === 'string') {
							try { additionalFields.custom_metadata = JSON.parse(additionalFields.custom_metadata as string); } catch { throw new Error('Invalid JSON in "Custom Metadata (JSON)"'); }
						}
						if (additionalFields.tag_ids) {
							additionalFields.tag_ids = (additionalFields.tag_ids as string).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
						}
						if (additionalFields.additional_tag_ids) {
							additionalFields.additional_tag_ids = (additionalFields.additional_tag_ids as string).split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
						}
						const mutationQs: IDataObject = {};
						if (additionalFields.update_balance !== undefined) { mutationQs.update_balance = additionalFields.update_balance; delete additionalFields.update_balance; }
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/transactions/${id}`, body, mutationQs);
					}

					if (operation === 'uploadAttachment') {
						const txId = this.getNodeParameter('uploadTransactionId', i) as number;
						const body: IDataObject = {};
						body.uploadTransactionId = this.getNodeParameter('uploadTransactionId', i);
						body.fileUrl = this.getNodeParameter('fileUrl', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/transactions/${txId}/attachments`, body);
					}

				}

				if (resource === 'tag') {
					if (operation === 'create') {
						const body: IDataObject = {};
						body.name = this.getNodeParameter('name', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/tags`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('tagId', i) as number;
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/tags/${id}`, {}, qs);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('tagId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/tags/${id}`);
					}

					if (operation === 'getAll') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/tags`);
						responseData = responseData.tags || responseData;
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('tagId', i) as number;
						const body: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/tags/${id}`, body);
					}

				}

				if (resource === 'recurringItem') {
					if (operation === 'get') {
						const id = this.getNodeParameter('recurringItemId', i) as number;
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/recurring_items/${id}`, {}, qs);
					}

					if (operation === 'getAll') {
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/recurring_items`, {}, qs);
						responseData = responseData.recurring_items || responseData;
					}

				}

				if (resource === 'budget') {
					if (operation === 'getSettings') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/budgets/settings`);
					}

					if (operation === 'remove') {
						const qs: IDataObject = {};
						qs.start_date = this.getNodeParameter('start_date', i);
						qs.category_id = this.getNodeParameter('category_id', i);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/budgets`, {}, qs);
					}

					if (operation === 'upsert') {
						const body: IDataObject = {};
						body.start_date = this.getNodeParameter('start_date', i);
						body.category_id = this.getNodeParameter('category_id', i);
						body.amount = this.getNodeParameter('amount', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/budgets`, body);
					}

				}

				if (resource === 'manualAccount') {
					if (operation === 'create') {
						const body: IDataObject = {};
						body.name = this.getNodeParameter('name', i);
						body.type = this.getNodeParameter('type', i);
						body.balance = this.getNodeParameter('balance', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.custom_metadata && typeof additionalFields.custom_metadata === 'string') {
							try { additionalFields.custom_metadata = JSON.parse(additionalFields.custom_metadata as string); } catch { throw new Error('Invalid JSON in "Custom Metadata (JSON)"'); }
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/manual_accounts`, body);
					}

					if (operation === 'delete') {
						const id = this.getNodeParameter('accountId', i) as number;
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/manual_accounts/${id}`, {}, qs);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('accountId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/manual_accounts/${id}`);
					}

					if (operation === 'getAll') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/manual_accounts`);
						responseData = responseData.manual_accounts || responseData;
					}

					if (operation === 'update') {
						const id = this.getNodeParameter('accountId', i) as number;
						const body: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.custom_metadata && typeof additionalFields.custom_metadata === 'string') {
							try { additionalFields.custom_metadata = JSON.parse(additionalFields.custom_metadata as string); } catch { throw new Error('Invalid JSON in "Custom Metadata (JSON)"'); }
						}
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/manual_accounts/${id}`, body);
					}

				}

				if (resource === 'plaidAccount') {
					if (operation === 'fetch') {
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/plaid_accounts/fetch`, {}, qs);
					}

					if (operation === 'get') {
						const id = this.getNodeParameter('plaidAccountId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/plaid_accounts/${id}`);
					}

					if (operation === 'getAll') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/plaid_accounts`);
						responseData = responseData.plaid_accounts || responseData;
					}

				}

				if (resource === 'crypto') {
					if (operation === 'createManual') {
						const body: IDataObject = {};
						body.name = this.getNodeParameter('name', i);
						body.currency = this.getNodeParameter('currency', i);
						body.balance = this.getNodeParameter('balance', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/crypto/manual`, body);
					}

					if (operation === 'deleteManual') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/crypto/manual/${id}`);
					}

					if (operation === 'getManual') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/crypto/manual/${id}`);
					}

					if (operation === 'getAllManual') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/crypto/manual`);
						responseData = responseData.crypto || responseData;
					}

					if (operation === 'getAllSynced') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced`);
						responseData = responseData.crypto || responseData;
					}

					if (operation === 'getSynced') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced/${id}`);
					}

					if (operation === 'getSyncedBySymbol') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						const symbol = this.getNodeParameter('cryptoSymbol', i) as string;
						const qs: IDataObject = {};
						qs.cryptoSymbol = this.getNodeParameter('cryptoSymbol', i);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced/${id}/${symbol}`, {}, qs);
					}

					if (operation === 'refreshSynced') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						const body: IDataObject = {};
						responseData = await lunchMoneyApiRequest.call(this, 'POST', `/crypto/synced/${id}/refresh`, body);
					}

					if (operation === 'updateManual') {
						const id = this.getNodeParameter('cryptoId', i) as number;
						const body: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/crypto/manual/${id}`, body);
					}

					if (operation === 'getAllLegacy') {
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/cryptocurrencies`);
						responseData = responseData.crypto || responseData;
					}

				}

				if (resource === 'balanceHistory') {
					if (operation === 'deleteEntry') {
						const entryId = this.getNodeParameter('entryId', i) as number;
						const body: IDataObject = {};
						body.entryId = this.getNodeParameter('entryId', i);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/entries/${entryId}`, body);
					}

					if (operation === 'deleteForAccount') {
						const accountType = this.getNodeParameter('account_type', i) as string;
						const accountId = this.getNodeParameter('account_id', i) as number;
						const body: IDataObject = {};
						body.account_type = this.getNodeParameter('account_type', i);
						body.account_id = this.getNodeParameter('account_id', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/${accountType}/${accountId}`, body);
					}

					if (operation === 'getAll') {
						const qs: IDataObject = {};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/balance_history`, {}, qs);
					}

					if (operation === 'getForAccount') {
						const accountType = this.getNodeParameter('account_type', i) as string;
						const accountId = this.getNodeParameter('account_id', i) as number;
						const qs: IDataObject = {};
						qs.account_type = this.getNodeParameter('account_type', i);
						qs.account_id = this.getNodeParameter('account_id', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/balance_history/${accountType}/${accountId}`, {}, qs);
					}

					if (operation === 'updateForAccount') {
						const accountType = this.getNodeParameter('account_type', i) as string;
						const accountId = this.getNodeParameter('account_id', i) as number;
						const body: IDataObject = {};
						body.account_type = this.getNodeParameter('account_type', i);
						body.account_id = this.getNodeParameter('account_id', i);
						const balanceEntriesRaw = this.getNodeParameter('balanceEntries', i) as string;
						try { body.balanceEntries = JSON.parse(balanceEntriesRaw); } catch { throw new Error('Invalid JSON in "Balance Entries (JSON)"'); }
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/${accountType}/${accountId}`, body);
					}

					if (operation === 'getCryptoSynced') {
						const accountId = this.getNodeParameter('account_id', i) as number;
						const symbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i) as number;
						const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const qs: IDataObject = {};
						qs.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
						qs.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						for (const k of Object.keys(additionalFields)) { if (additionalFields[k] === '') delete additionalFields[k]; }
						Object.assign(qs, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'GET', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, {}, qs);
					}

					if (operation === 'updateCryptoSynced') {
						const accountId = this.getNodeParameter('account_id', i) as number;
						const symbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i) as number;
						const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const body: IDataObject = {};
						body.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
						body.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
						const balanceEntriesRaw = this.getNodeParameter('balanceEntries', i) as string;
						try { body.balanceEntries = JSON.parse(balanceEntriesRaw); } catch { throw new Error('Invalid JSON in "Balance Entries (JSON)"'); }
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, body);
					}

					if (operation === 'deleteCryptoSynced') {
						const accountId = this.getNodeParameter('account_id', i) as number;
						const symbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i) as number;
						const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i) as string;
						const body: IDataObject = {};
						body.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
						body.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);
						responseData = await lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, body);
					}

					if (operation === 'updateDeletedDetails') {
						const accountId = this.getNodeParameter('account_id', i) as number;
						const delAccountId = this.getNodeParameter('deletedAccountId', i) as number;
						const body: IDataObject = {};
						body.deletedAccountId = this.getNodeParameter('deletedAccountId', i);
						const detailsDataRaw = this.getNodeParameter('detailsData', i) as string;
						try { body.detailsData = JSON.parse(detailsDataRaw); } catch { throw new Error('Invalid JSON in "Details (JSON)"'); }
						responseData = await lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/deleted/${delAccountId}/details`, body);
					}

				}


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
