"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LunchMoney = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
class LunchMoney {
    constructor() {
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...descriptions_1.userOperations,
                ...descriptions_1.userFields,
                ...descriptions_1.categoryOperations,
                ...descriptions_1.categoryFields,
                ...descriptions_1.transactionOperations,
                ...descriptions_1.transactionFields,
                ...descriptions_1.tagOperations,
                ...descriptions_1.tagFields,
                ...descriptions_1.recurringItemOperations,
                ...descriptions_1.recurringItemFields,
                ...descriptions_1.budgetOperations,
                ...descriptions_1.budgetFields,
                ...descriptions_1.manualAccountOperations,
                ...descriptions_1.manualAccountFields,
                ...descriptions_1.plaidAccountOperations,
                ...descriptions_1.plaidAccountFields,
                ...descriptions_1.cryptoOperations,
                ...descriptions_1.cryptoFields,
                ...descriptions_1.balanceHistoryOperations,
                ...descriptions_1.balanceHistoryFields,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (resource === 'user') {
                    if (operation === 'get') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/me`);
                    }
                    if (operation === 'getSummary') {
                        const qs = {};
                        qs.start_date = this.getNodeParameter('start_date', i);
                        qs.end_date = this.getNodeParameter('end_date', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/summary`, {}, qs);
                    }
                }
                if (resource === 'category') {
                    if (operation === 'create') {
                        const body = {};
                        body.name = this.getNodeParameter('name', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/categories`, body);
                    }
                    if (operation === 'delete') {
                        const id = this.getNodeParameter('categoryId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/categories/${id}`);
                    }
                    if (operation === 'get') {
                        const id = this.getNodeParameter('categoryId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/categories/${id}`);
                    }
                    if (operation === 'getAll') {
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/categories`, {}, qs);
                        responseData = responseData.categories || responseData;
                    }
                    if (operation === 'update') {
                        const id = this.getNodeParameter('categoryId', i);
                        const body = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/categories/${id}`, body);
                    }
                }
                if (resource === 'transaction') {
                    if (operation === 'create') {
                        const body = {};
                        body.date = this.getNodeParameter('date', i);
                        body.amount = this.getNodeParameter('amount', i);
                        body.payee = this.getNodeParameter('payee', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.tag_ids) {
                            additionalFields.tag_ids = additionalFields.tag_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                        }
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/transactions`, { transactions: [body] });
                    }
                    if (operation === 'createGroup') {
                        const body = {};
                        body.date = this.getNodeParameter('date', i);
                        body.payee = this.getNodeParameter('payee', i);
                        const idsStr = this.getNodeParameter('ids', i);
                        body.ids = idsStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.tag_ids) {
                            additionalFields.tag_ids = additionalFields.tag_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                        }
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/transactions/group`, body);
                    }
                    if (operation === 'delete') {
                        const id = this.getNodeParameter('transactionId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/${id}`);
                    }
                    if (operation === 'deleteAttachment') {
                        const fileId = this.getNodeParameter('fileId', i);
                        const body = {};
                        body.fileId = this.getNodeParameter('fileId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/attachments/${fileId}`, body);
                    }
                    if (operation === 'deleteGroup') {
                        const groupId = this.getNodeParameter('groupId', i);
                        const body = {};
                        body.groupId = this.getNodeParameter('groupId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/group/${groupId}`, body);
                    }
                    if (operation === 'get') {
                        const id = this.getNodeParameter('transactionId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/transactions/${id}`);
                    }
                    if (operation === 'getAttachment') {
                        const fileId = this.getNodeParameter('fileId', i);
                        const qs = {};
                        qs.fileId = this.getNodeParameter('fileId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/transactions/attachments/${fileId}`, {}, qs);
                    }
                    if (operation === 'getAll') {
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/transactions`, {}, qs);
                        responseData = responseData.transactions || responseData;
                    }
                    if (operation === 'split') {
                        const id = this.getNodeParameter('transactionId', i);
                        const body = {};
                        const childTransactionsRaw = this.getNodeParameter('child_transactions', i);
                        try {
                            body.child_transactions = JSON.parse(childTransactionsRaw);
                        }
                        catch {
                            throw new Error('Invalid JSON in "Child Transactions (JSON)"');
                        }
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/transactions/split/${id}`, body);
                    }
                    if (operation === 'unsplit') {
                        const id = this.getNodeParameter('transactionId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/transactions/split/${id}`);
                    }
                    if (operation === 'update') {
                        const id = this.getNodeParameter('transactionId', i);
                        const body = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (additionalFields.tag_ids) {
                            additionalFields.tag_ids = additionalFields.tag_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                        }
                        if (additionalFields.additional_tag_ids) {
                            additionalFields.additional_tag_ids = additionalFields.additional_tag_ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                        }
                        const mutationQs = {};
                        if (additionalFields.update_balance !== undefined) {
                            mutationQs.update_balance = additionalFields.update_balance;
                            delete additionalFields.update_balance;
                        }
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/transactions/${id}`, body, mutationQs);
                    }
                    if (operation === 'uploadAttachment') {
                        const txId = this.getNodeParameter('uploadTransactionId', i);
                        const body = {};
                        body.uploadTransactionId = this.getNodeParameter('uploadTransactionId', i);
                        body.fileUrl = this.getNodeParameter('fileUrl', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/transactions/${txId}/attachments`, body);
                    }
                }
                if (resource === 'tag') {
                    if (operation === 'create') {
                        const body = {};
                        body.name = this.getNodeParameter('name', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/tags`, body);
                    }
                    if (operation === 'delete') {
                        const id = this.getNodeParameter('tagId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/tags/${id}`);
                    }
                    if (operation === 'get') {
                        const id = this.getNodeParameter('tagId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/tags/${id}`);
                    }
                    if (operation === 'getAll') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/tags`);
                        responseData = responseData.tags || responseData;
                    }
                    if (operation === 'update') {
                        const id = this.getNodeParameter('tagId', i);
                        const body = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/tags/${id}`, body);
                    }
                }
                if (resource === 'recurringItem') {
                    if (operation === 'get') {
                        const id = this.getNodeParameter('recurringItemId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/recurring_items/${id}`);
                    }
                    if (operation === 'getAll') {
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/recurring_items`, {}, qs);
                        responseData = responseData.recurring_items || responseData;
                    }
                }
                if (resource === 'budget') {
                    if (operation === 'getSettings') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/budgets/settings`);
                    }
                    if (operation === 'remove') {
                        const qs = {};
                        qs.start_date = this.getNodeParameter('start_date', i);
                        qs.category_id = this.getNodeParameter('category_id', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/budgets`, {}, qs);
                    }
                    if (operation === 'upsert') {
                        const body = {};
                        body.start_date = this.getNodeParameter('start_date', i);
                        body.category_id = this.getNodeParameter('category_id', i);
                        body.amount = this.getNodeParameter('amount', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/budgets`, body);
                    }
                }
                if (resource === 'manualAccount') {
                    if (operation === 'create') {
                        const body = {};
                        body.name = this.getNodeParameter('name', i);
                        body.type = this.getNodeParameter('type', i);
                        body.balance = this.getNodeParameter('balance', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/manual_accounts`, body);
                    }
                    if (operation === 'delete') {
                        const id = this.getNodeParameter('accountId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/manual_accounts/${id}`);
                    }
                    if (operation === 'get') {
                        const id = this.getNodeParameter('accountId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/manual_accounts/${id}`);
                    }
                    if (operation === 'getAll') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/manual_accounts`);
                        responseData = responseData.manual_accounts || responseData;
                    }
                    if (operation === 'update') {
                        const id = this.getNodeParameter('accountId', i);
                        const body = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/manual_accounts/${id}`, body);
                    }
                }
                if (resource === 'plaidAccount') {
                    if (operation === 'fetch') {
                        const body = {};
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/plaid_accounts/fetch`, body);
                    }
                    if (operation === 'get') {
                        const id = this.getNodeParameter('plaidAccountId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/plaid_accounts/${id}`);
                    }
                    if (operation === 'getAll') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/plaid_accounts`);
                        responseData = responseData.plaid_accounts || responseData;
                    }
                }
                if (resource === 'crypto') {
                    if (operation === 'createManual') {
                        const body = {};
                        body.name = this.getNodeParameter('name', i);
                        body.currency = this.getNodeParameter('currency', i);
                        body.balance = this.getNodeParameter('balance', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/crypto/manual`, body);
                    }
                    if (operation === 'deleteManual') {
                        const id = this.getNodeParameter('cryptoId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/crypto/manual/${id}`);
                    }
                    if (operation === 'getManual') {
                        const id = this.getNodeParameter('cryptoId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/crypto/manual/${id}`);
                    }
                    if (operation === 'getAllManual') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/crypto/manual`);
                        responseData = responseData.crypto || responseData;
                    }
                    if (operation === 'getAllSynced') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced`);
                        responseData = responseData.crypto || responseData;
                    }
                    if (operation === 'getSynced') {
                        const id = this.getNodeParameter('cryptoId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced/${id}`);
                    }
                    if (operation === 'getSyncedBySymbol') {
                        const id = this.getNodeParameter('cryptoId', i);
                        const symbol = this.getNodeParameter('cryptoSymbol', i);
                        const qs = {};
                        qs.cryptoSymbol = this.getNodeParameter('cryptoSymbol', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/crypto/synced/${id}/${symbol}`, {}, qs);
                    }
                    if (operation === 'refreshSynced') {
                        const id = this.getNodeParameter('cryptoId', i);
                        const body = {};
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'POST', `/crypto/synced/${id}/refresh`, body);
                    }
                    if (operation === 'updateManual') {
                        const id = this.getNodeParameter('cryptoId', i);
                        const body = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/crypto/manual/${id}`, body);
                    }
                    if (operation === 'getAllLegacy') {
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/cryptocurrencies`);
                        responseData = responseData.crypto || responseData;
                    }
                }
                if (resource === 'balanceHistory') {
                    if (operation === 'deleteEntry') {
                        const entryId = this.getNodeParameter('entryId', i);
                        const body = {};
                        body.entryId = this.getNodeParameter('entryId', i);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/entries/${entryId}`, body);
                    }
                    if (operation === 'deleteForAccount') {
                        const accountType = this.getNodeParameter('account_type', i);
                        const accountId = this.getNodeParameter('account_id', i);
                        const body = {};
                        body.account_type = this.getNodeParameter('account_type', i);
                        body.account_id = this.getNodeParameter('account_id', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/${accountType}/${accountId}`, body);
                    }
                    if (operation === 'getAll') {
                        const qs = {};
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/balance_history`, {}, qs);
                    }
                    if (operation === 'getForAccount') {
                        const accountType = this.getNodeParameter('account_type', i);
                        const accountId = this.getNodeParameter('account_id', i);
                        const qs = {};
                        qs.account_type = this.getNodeParameter('account_type', i);
                        qs.account_id = this.getNodeParameter('account_id', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/balance_history/${accountType}/${accountId}`, {}, qs);
                    }
                    if (operation === 'updateForAccount') {
                        const accountType = this.getNodeParameter('account_type', i);
                        const accountId = this.getNodeParameter('account_id', i);
                        const body = {};
                        body.account_type = this.getNodeParameter('account_type', i);
                        body.account_id = this.getNodeParameter('account_id', i);
                        const balanceEntriesRaw = this.getNodeParameter('balanceEntries', i);
                        try {
                            body.balanceEntries = JSON.parse(balanceEntriesRaw);
                        }
                        catch {
                            throw new Error('Invalid JSON in "Balance Entries (JSON)"');
                        }
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/${accountType}/${accountId}`, body);
                    }
                    if (operation === 'getCryptoSynced') {
                        const accountId = this.getNodeParameter('account_id', i);
                        const symbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const qs = {};
                        qs.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        qs.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        for (const k of Object.keys(additionalFields)) {
                            if (additionalFields[k] === '')
                                delete additionalFields[k];
                        }
                        Object.assign(qs, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'GET', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, {}, qs);
                    }
                    if (operation === 'updateCryptoSynced') {
                        const accountId = this.getNodeParameter('account_id', i);
                        const symbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const body = {};
                        body.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        body.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const balanceEntriesRaw = this.getNodeParameter('balanceEntries', i);
                        try {
                            body.balanceEntries = JSON.parse(balanceEntriesRaw);
                        }
                        catch {
                            throw new Error('Invalid JSON in "Balance Entries (JSON)"');
                        }
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, body);
                    }
                    if (operation === 'deleteCryptoSynced') {
                        const accountId = this.getNodeParameter('account_id', i);
                        const symbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const csAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        const csSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const body = {};
                        body.cryptoSyncedAccountId = this.getNodeParameter('cryptoSyncedAccountId', i);
                        body.cryptoSyncedSymbol = this.getNodeParameter('cryptoSyncedSymbol', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        Object.assign(body, additionalFields);
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'DELETE', `/balance_history/crypto_synced/${csAccountId}/${csSymbol}`, body);
                    }
                    if (operation === 'updateDeletedDetails') {
                        const accountId = this.getNodeParameter('account_id', i);
                        const delAccountId = this.getNodeParameter('deletedAccountId', i);
                        const body = {};
                        body.deletedAccountId = this.getNodeParameter('deletedAccountId', i);
                        const detailsDataRaw = this.getNodeParameter('detailsData', i);
                        try {
                            body.detailsData = JSON.parse(detailsDataRaw);
                        }
                        catch {
                            throw new Error('Invalid JSON in "Details (JSON)"');
                        }
                        responseData = await GenericFunctions_1.lunchMoneyApiRequest.call(this, 'PUT', `/balance_history/deleted/${delAccountId}/details`, body);
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
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
exports.LunchMoney = LunchMoney;
//# sourceMappingURL=LunchMoney.node.js.map