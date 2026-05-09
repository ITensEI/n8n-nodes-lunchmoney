const fs = require('fs');
const path = require('path');

const { byTag, endpoints } = JSON.parse(
	fs.readFileSync(path.join(__dirname, '..', 'lm-endpoints.json'), 'utf8'),
);

const NODES_DIR = path.join(__dirname, '..', 'nodes', 'LunchMoney');
const DESC_DIR = path.join(NODES_DIR, 'descriptions');

fs.mkdirSync(DESC_DIR, { recursive: true });

// ── Resource → Operation → Endpoint mapping ──

const RESOURCE_MAP = {
	user: {
		displayName: 'User',
		operations: [
			{ name: 'Get Current User', value: 'get', opId: 'getCurrentUser', method: 'GET', path: '/me', desc: 'Get details about the current user', action: 'Get current user' },
			{ name: 'Get Summary', value: 'getSummary', opId: 'getSummary', method: 'GET', path: '/summary', desc: 'Get a summary of the user account', action: 'Get account summary' },
		],
	},
	category: {
		displayName: 'Category',
		operations: [
			{ name: 'Create', value: 'create', opId: 'createCategory', method: 'POST', path: '/categories', desc: 'Create a new category', action: 'Create a category' },
			{ name: 'Delete', value: 'delete', opId: 'deleteCategory', method: 'DELETE', path: '/categories/{id}', desc: 'Delete a category', action: 'Delete a category' },
			{ name: 'Get', value: 'get', opId: 'getCategoryById', method: 'GET', path: '/categories/{id}', desc: 'Get a single category by ID', action: 'Get a category' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllCategories', method: 'GET', path: '/categories', desc: 'Get all categories', action: 'Get many categories' },
			{ name: 'Update', value: 'update', opId: 'updateCategory', method: 'PUT', path: '/categories/{id}', desc: 'Update a category', action: 'Update a category' },
		],
	},
	transaction: {
		displayName: 'Transaction',
		operations: [
			{ name: 'Create', value: 'create', opId: 'createTransactions', method: 'POST', path: '/transactions', desc: 'Create one or more transactions', action: 'Create transactions' },
			{ name: 'Create Group', value: 'createGroup', opId: 'createTransactionGroup', method: 'POST', path: '/transactions/group', desc: 'Group multiple transactions', action: 'Create a transaction group' },
			{ name: 'Delete', value: 'delete', opId: 'deleteTransaction', method: 'DELETE', path: '/transactions/{id}', desc: 'Delete a single transaction', action: 'Delete a transaction' },
			{ name: 'Delete Attachment', value: 'deleteAttachment', opId: 'deleteTransactionAttachment', method: 'DELETE', path: '/transactions/attachments/{file_id}', desc: 'Delete a transaction attachment', action: 'Delete a transaction attachment' },
			{ name: 'Delete Group', value: 'deleteGroup', opId: 'deleteTransactionGroup', method: 'DELETE', path: '/transactions/group/{id}', desc: 'Delete a transaction group', action: 'Delete a transaction group' },
			{ name: 'Get', value: 'get', opId: 'getTransactionById', method: 'GET', path: '/transactions/{id}', desc: 'Get a single transaction by ID', action: 'Get a transaction' },
			{ name: 'Get Attachment', value: 'getAttachment', opId: 'getTransactionAttachment', method: 'GET', path: '/transactions/attachments/{file_id}', desc: 'Get a transaction attachment', action: 'Get a transaction attachment' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllTransactions', method: 'GET', path: '/transactions', desc: 'Get all transactions with optional filters', action: 'Get many transactions' },
			{ name: 'Split', value: 'split', opId: 'splitTransaction', method: 'POST', path: '/transactions/split/{id}', desc: 'Split a transaction into parts', action: 'Split a transaction' },
			{ name: 'Unsplit', value: 'unsplit', opId: 'unsplitTransaction', method: 'DELETE', path: '/transactions/split/{id}', desc: 'Remove split from a transaction', action: 'Unsplit a transaction' },
			{ name: 'Update', value: 'update', opId: 'updateTransaction', method: 'PUT', path: '/transactions/{id}', desc: 'Update a single transaction', action: 'Update a transaction' },
			{ name: 'Upload Attachment', value: 'uploadAttachment', opId: 'uploadTransactionAttachment', method: 'POST', path: '/transactions/{transaction_id}/attachments', desc: 'Upload an attachment to a transaction', action: 'Upload a transaction attachment' },
		],
	},
	tag: {
		displayName: 'Tag',
		operations: [
			{ name: 'Create', value: 'create', opId: 'createTag', method: 'POST', path: '/tags', desc: 'Create a new tag', action: 'Create a tag' },
			{ name: 'Delete', value: 'delete', opId: 'deleteTag', method: 'DELETE', path: '/tags/{id}', desc: 'Delete a tag', action: 'Delete a tag' },
			{ name: 'Get', value: 'get', opId: 'getTagById', method: 'GET', path: '/tags/{id}', desc: 'Get a single tag by ID', action: 'Get a tag' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllTags', method: 'GET', path: '/tags', desc: 'Get all tags', action: 'Get many tags' },
			{ name: 'Update', value: 'update', opId: 'updateTag', method: 'PUT', path: '/tags/{id}', desc: 'Update a tag', action: 'Update a tag' },
		],
	},
	recurringItem: {
		displayName: 'Recurring Item',
		operations: [
			{ name: 'Get', value: 'get', opId: 'getRecurringById', method: 'GET', path: '/recurring_items/{id}', desc: 'Get a single recurring item by ID', action: 'Get a recurring item' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllRecurring', method: 'GET', path: '/recurring_items', desc: 'Get all recurring items', action: 'Get many recurring items' },
		],
	},
	budget: {
		displayName: 'Budget',
		operations: [
			{ name: 'Get Settings', value: 'getSettings', opId: 'getBudgetSettings', method: 'GET', path: '/budgets/settings', desc: 'Get budget settings', action: 'Get budget settings' },
			{ name: 'Remove', value: 'remove', opId: 'removeBudget', method: 'DELETE', path: '/budgets', desc: 'Remove a budget entry', action: 'Remove a budget entry' },
			{ name: 'Upsert', value: 'upsert', opId: 'upsertBudget', method: 'PUT', path: '/budgets', desc: 'Create or update a budget entry', action: 'Upsert a budget entry' },
		],
	},
	manualAccount: {
		displayName: 'Manual Account',
		operations: [
			{ name: 'Create', value: 'create', opId: 'createManualAccount', method: 'POST', path: '/manual_accounts', desc: 'Create a new manual account', action: 'Create a manual account' },
			{ name: 'Delete', value: 'delete', opId: 'deleteManualAccount', method: 'DELETE', path: '/manual_accounts/{id}', desc: 'Delete a manual account', action: 'Delete a manual account' },
			{ name: 'Get', value: 'get', opId: 'getManualAccountById', method: 'GET', path: '/manual_accounts/{id}', desc: 'Get a single manual account by ID', action: 'Get a manual account' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllManualAccounts', method: 'GET', path: '/manual_accounts', desc: 'Get all manual accounts', action: 'Get many manual accounts' },
			{ name: 'Update', value: 'update', opId: 'updateManualAccount', method: 'PUT', path: '/manual_accounts/{id}', desc: 'Update a manual account', action: 'Update a manual account' },
		],
	},
	plaidAccount: {
		displayName: 'Plaid Account',
		operations: [
			{ name: 'Fetch Latest', value: 'fetch', opId: 'triggerPlaidFetch', method: 'POST', path: '/plaid_accounts/fetch', desc: 'Trigger a fetch of latest data from Plaid', action: 'Fetch latest Plaid data' },
			{ name: 'Get', value: 'get', opId: 'getPlaidAccountById', method: 'GET', path: '/plaid_accounts/{id}', desc: 'Get a single Plaid account by ID', action: 'Get a Plaid account' },
			{ name: 'Get Many', value: 'getAll', opId: 'getAllPlaidAccounts', method: 'GET', path: '/plaid_accounts', desc: 'Get all Plaid accounts', action: 'Get many Plaid accounts' },
		],
	},
	crypto: {
		displayName: 'Crypto',
		operations: [
			{ name: 'Create Manual', value: 'createManual', opId: 'createCryptoManual', method: 'POST', path: '/crypto/manual', desc: 'Create a manual crypto account', action: 'Create a manual crypto account' },
			{ name: 'Delete Manual', value: 'deleteManual', opId: 'deleteCryptoManual', method: 'DELETE', path: '/crypto/manual/{id}', desc: 'Delete a manual crypto account', action: 'Delete a manual crypto account' },
			{ name: 'Get Manual', value: 'getManual', opId: 'getCryptoManualById', method: 'GET', path: '/crypto/manual/{id}', desc: 'Get a manual crypto account by ID', action: 'Get a manual crypto account' },
			{ name: 'Get Many Manual', value: 'getAllManual', opId: 'getAllCryptoManual', method: 'GET', path: '/crypto/manual', desc: 'Get all manual crypto accounts', action: 'Get many manual crypto accounts' },
			{ name: 'Get Many Synced', value: 'getAllSynced', opId: 'getAllCryptoSynced', method: 'GET', path: '/crypto/synced', desc: 'Get all synced crypto accounts', action: 'Get many synced crypto accounts' },
			{ name: 'Get Synced', value: 'getSynced', opId: 'getCryptoSyncedById', method: 'GET', path: '/crypto/synced/{id}', desc: 'Get a synced crypto account by ID', action: 'Get a synced crypto account' },
			{ name: 'Get Synced By Symbol', value: 'getSyncedBySymbol', opId: 'getCryptoSyncedBalanceBySymbol', method: 'GET', path: '/crypto/synced/{id}/{symbol}', desc: 'Get synced crypto balance for a specific symbol', action: 'Get synced crypto by symbol' },
			{ name: 'Refresh Synced', value: 'refreshSynced', opId: 'refreshCryptoSynced', method: 'POST', path: '/crypto/synced/{id}/refresh', desc: 'Refresh balances for a synced crypto account', action: 'Refresh synced crypto balances' },
			{ name: 'Update Manual', value: 'updateManual', opId: 'updateCryptoManual', method: 'PUT', path: '/crypto/manual/{id}', desc: 'Update a manual crypto account', action: 'Update a manual crypto account' },
			{ name: 'Get All (Legacy)', value: 'getAllLegacy', opId: 'getAllCryptocurrencies', method: 'GET', path: '/cryptocurrencies', desc: 'Get all cryptocurrencies (legacy endpoint)', action: 'Get all cryptocurrencies (legacy)' },
		],
	},
	balanceHistory: {
		displayName: 'Balance History',
		operations: [
			{ name: 'Delete Entry', value: 'deleteEntry', opId: 'deleteBalanceHistoryEntry', method: 'DELETE', path: '/balance_history/entries/{id}', desc: 'Delete a balance history entry', action: 'Delete a balance history entry' },
			{ name: 'Delete For Account', value: 'deleteForAccount', opId: 'deleteBalanceHistoryForAccount', method: 'DELETE', path: '/balance_history/{account_type}/{account_id}', desc: 'Delete balance history for an account', action: 'Delete balance history for account' },
			{ name: 'Get All', value: 'getAll', opId: 'getAllBalanceHistory', method: 'GET', path: '/balance_history', desc: 'Get balance history overview', action: 'Get all balance history' },
			{ name: 'Get For Account', value: 'getForAccount', opId: 'getBalanceHistoryForAccount', method: 'GET', path: '/balance_history/{account_type}/{account_id}', desc: 'Get balance history for an account', action: 'Get balance history for account' },
			{ name: 'Update For Account', value: 'updateForAccount', opId: 'upsertBalanceHistoryForAccount', method: 'PUT', path: '/balance_history/{account_type}/{account_id}', desc: 'Create or update balance history for an account', action: 'Update balance history for account' },
			{ name: 'Get Crypto Synced', value: 'getCryptoSynced', opId: 'getBalanceHistoryForCryptoSynced', method: 'GET', path: '/balance_history/crypto_synced/{account_id}/{symbol}', desc: 'Get balance history for a synced crypto account and symbol', action: 'Get crypto synced balance history' },
			{ name: 'Update Crypto Synced', value: 'updateCryptoSynced', opId: 'upsertBalanceHistoryForCryptoSynced', method: 'PUT', path: '/balance_history/crypto_synced/{account_id}/{symbol}', desc: 'Update balance history for a synced crypto account and symbol', action: 'Update crypto synced balance history' },
			{ name: 'Delete Crypto Synced', value: 'deleteCryptoSynced', opId: 'deleteBalanceHistoryForCryptoSynced', method: 'DELETE', path: '/balance_history/crypto_synced/{account_id}/{symbol}', desc: 'Delete balance history for a synced crypto account and symbol', action: 'Delete crypto synced balance history' },
			{ name: 'Update Deleted Details', value: 'updateDeletedDetails', opId: 'updateBalanceHistoryDetails', method: 'PUT', path: '/balance_history/deleted/{account_id}/details', desc: 'Update display details for a deleted account in balance history', action: 'Update deleted account details' },
		],
	},
};

// ── Custom field definitions per resource/operation ──

const FIELDS = {
	category: {
		_idField: { name: 'categoryId', displayName: 'Category ID', ops: ['get', 'update', 'delete'] },
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the category' },
			],
			optional: [
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the category' },
				{ name: 'is_income', displayName: 'Is Income', type: 'boolean', desc: 'Whether transactions in this category are treated as income' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'Whether to exclude from budget calculations' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'Whether to exclude from totals' },
				{ name: 'group_id', displayName: 'Group ID', type: 'number', desc: 'ID of the category group this belongs to' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the category' },
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the category' },
				{ name: 'is_income', displayName: 'Is Income', type: 'boolean', desc: 'Whether transactions in this category are treated as income' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'Whether to exclude from budget calculations' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'Whether to exclude from totals' },
				{ name: 'group_id', displayName: 'Group ID', type: 'number', desc: 'ID of the category group this belongs to' },
				{ name: 'archived', displayName: 'Archived', type: 'boolean', desc: 'Whether the category is archived' },
			],
		},
	},
	transaction: {
		_idField: { name: 'transactionId', displayName: 'Transaction ID', ops: ['get', 'update', 'delete', 'split', 'unsplit'] },
		getAll: {
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Filter by start date (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'Filter by end date (YYYY-MM-DD)', placeholder: '2024-12-31' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Filter by category ID' },
				{ name: 'tag_id', displayName: 'Tag ID', type: 'number', desc: 'Filter by tag ID' },
				{ name: 'recurring_id', displayName: 'Recurring ID', type: 'number', desc: 'Filter by recurring item ID' },
				{ name: 'plaid_account_id', displayName: 'Plaid Account ID', type: 'number', desc: 'Filter by Plaid account ID' },
				{ name: 'manual_account_id', displayName: 'Manual Account ID', type: 'number', desc: 'Filter by manual account ID' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Filter by status', options: ['cleared', 'uncleared', 'reviewed', 'pending'] },
				{ name: 'is_group', displayName: 'Is Group', type: 'boolean', desc: 'Filter for group parent transactions only' },
				{ name: 'has_notes', displayName: 'Has Notes', type: 'boolean', desc: 'Filter for transactions with notes' },
				{ name: 'has_attachments', displayName: 'Has Attachments', type: 'boolean', desc: 'Filter for transactions with attachments' },
				{ name: 'offset', displayName: 'Offset', type: 'number', desc: 'Number of records to skip for pagination' },
				{ name: 'limit', displayName: 'Limit', type: 'number', desc: 'Maximum number of records to return' },
			],
		},
		create: {
			required: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date of the transaction (YYYY-MM-DD)', placeholder: '2024-01-15' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Amount as a decimal string (e.g. "25.00")', placeholder: '25.00' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'Payee or merchant name' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'ISO 4217 currency code (e.g. "usd")', placeholder: 'usd' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category to assign' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Transaction notes' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Transaction status', options: ['cleared', 'uncleared'] },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'External ID for deduplication' },
				{ name: 'manual_account_id', displayName: 'Manual Account ID', type: 'number', desc: 'Manual account to associate with' },
				{ name: 'tag_ids', displayName: 'Tag IDs', type: 'string', desc: 'Comma-separated list of tag IDs to assign' },
				{ name: 'recurring_id', displayName: 'Recurring Item ID', type: 'number', desc: 'Recurring item to link to' },
			],
		},
		update: {
			optional: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date of the transaction (YYYY-MM-DD)' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Amount as a decimal string' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'Payee or merchant name' },
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'ISO 4217 currency code' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category to assign' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Transaction notes' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Transaction status', options: ['cleared', 'uncleared', 'reviewed'] },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'External identifier' },
				{ name: 'tag_ids', displayName: 'Tag IDs', type: 'string', desc: 'Comma-separated list of tag IDs' },
			],
		},
		createGroup: {
			required: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date for the group transaction (YYYY-MM-DD)', placeholder: '2024-01-15' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'Payee for the group transaction' },
				{ name: 'transaction_ids', displayName: 'Transaction IDs', type: 'string', desc: 'Comma-separated list of transaction IDs to group' },
			],
			optional: [
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category for the group' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes for the group' },
				{ name: 'tag_ids', displayName: 'Tag IDs', type: 'string', desc: 'Comma-separated tag IDs' },
			],
		},
		deleteGroup: {
			required: [
				{ name: 'groupId', displayName: 'Group ID', type: 'number', desc: 'ID of the group to delete' },
			],
		},
		split: {
			required: [
				{ name: 'splitData', displayName: 'Split Parts (JSON)', type: 'json', desc: 'JSON array of split parts, each with amount and optionally category_id, payee, notes' },
			],
		},
		uploadAttachment: {
			required: [
				{ name: 'uploadTransactionId', displayName: 'Transaction ID', type: 'number', desc: 'ID of the transaction to attach the file to' },
				{ name: 'fileUrl', displayName: 'File URL', type: 'string', desc: 'URL of the file to attach' },
			],
			optional: [
				{ name: 'fileName', displayName: 'File Name', type: 'string', desc: 'Name for the attachment file' },
			],
		},
		getAttachment: {
			required: [
				{ name: 'fileId', displayName: 'File ID', type: 'number', desc: 'ID of the attachment file' },
			],
		},
		deleteAttachment: {
			required: [
				{ name: 'fileId', displayName: 'File ID', type: 'number', desc: 'ID of the attachment file to delete' },
			],
		},
	},
	tag: {
		_idField: { name: 'tagId', displayName: 'Tag ID', ops: ['get', 'update', 'delete'] },
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the tag' },
			],
			optional: [
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the tag' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the tag' },
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the tag' },
			],
		},
	},
	recurringItem: {
		_idField: { name: 'recurringItemId', displayName: 'Recurring Item ID', ops: ['get'] },
		getAll: {
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date for the recurring items window (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date for the recurring items window (YYYY-MM-DD)', placeholder: '2024-12-31' },
			],
		},
	},
	budget: {
		getSettings: {},
		upsert: {
			required: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date for the budget period (YYYY-MM-DD, first of month)', placeholder: '2024-01-01' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category ID for the budget' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Budget amount as decimal string', placeholder: '500.00' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'ISO 4217 currency code', placeholder: 'usd' },
			],
		},
		remove: {
			required: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date of the budget period to remove (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category ID of the budget to remove' },
			],
		},
	},
	manualAccount: {
		_idField: { name: 'accountId', displayName: 'Account ID', ops: ['get', 'update', 'delete'] },
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the account' },
				{ name: 'type_name', displayName: 'Account Type', type: 'options', desc: 'Type of the account', options: ['cash', 'credit', 'investment', 'real estate', 'loan', 'vehicle', 'other liability', 'other asset', 'cryptocurrency', 'employee compensation'] },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'Current balance as decimal string', placeholder: '1000.00' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'ISO 4217 currency code', placeholder: 'usd' },
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'Name of the financial institution' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes about the account' },
				{ name: 'closed', displayName: 'Closed', type: 'boolean', desc: 'Whether the account is closed' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'Whether to exclude from budget' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'Whether to exclude from totals' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the account' },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'Current balance as decimal string' },
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'ISO 4217 currency code' },
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'Name of the financial institution' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes about the account' },
				{ name: 'closed', displayName: 'Closed', type: 'boolean', desc: 'Whether the account is closed' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'Whether to exclude from budget' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'Whether to exclude from totals' },
			],
		},
	},
	plaidAccount: {
		_idField: { name: 'plaidAccountId', displayName: 'Plaid Account ID', ops: ['get'] },
		fetch: {},
	},
	crypto: {
		_idField: { name: 'cryptoId', displayName: 'Crypto Account ID', ops: ['getManual', 'updateManual', 'deleteManual', 'getSynced', 'getSyncedBySymbol', 'refreshSynced'] },
		createManual: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the crypto account' },
				{ name: 'currency', displayName: 'Currency/Symbol', type: 'string', desc: 'Cryptocurrency symbol (e.g. "btc")', placeholder: 'btc' },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'Current balance', placeholder: '0.5' },
			],
			optional: [
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'Name of the exchange or wallet' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes about this crypto account' },
			],
		},
		updateManual: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the crypto account' },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'Current balance' },
				{ name: 'currency', displayName: 'Currency/Symbol', type: 'string', desc: 'Cryptocurrency symbol' },
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'Exchange or wallet name' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes about this account' },
			],
		},
		getSyncedBySymbol: {
			required: [
				{ name: 'cryptoSymbol', displayName: 'Symbol', type: 'string', desc: 'Cryptocurrency symbol (e.g. "btc")', placeholder: 'btc' },
			],
		},
	},
	balanceHistory: {
		getAll: {
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date (YYYY-MM-DD)', placeholder: '2024-12-31' },
			],
		},
		getForAccount: {
			required: [
				{ name: 'account_type', displayName: 'Account Type', type: 'options', desc: 'Type of account', options: ['manual', 'plaid', 'crypto_manual', 'deleted'] },
				{ name: 'account_id', displayName: 'Account ID', type: 'number', desc: 'ID of the account' },
			],
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date (YYYY-MM-DD)', placeholder: '2024-12-31' },
			],
		},
		updateForAccount: {
			required: [
				{ name: 'account_type', displayName: 'Account Type', type: 'options', desc: 'Type of account', options: ['manual', 'plaid', 'crypto_manual', 'deleted'] },
				{ name: 'account_id', displayName: 'Account ID', type: 'number', desc: 'ID of the account' },
				{ name: 'balanceEntries', displayName: 'Balance Entries (JSON)', type: 'json', desc: 'JSON array of balance entries with date and balance fields' },
			],
		},
		deleteForAccount: {
			required: [
				{ name: 'account_type', displayName: 'Account Type', type: 'options', desc: 'Type of account', options: ['manual', 'plaid', 'crypto_manual', 'deleted'] },
				{ name: 'account_id', displayName: 'Account ID', type: 'number', desc: 'ID of the account' },
			],
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date of range to delete (YYYY-MM-DD)' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date of range to delete (YYYY-MM-DD)' },
			],
		},
		deleteEntry: {
			required: [
				{ name: 'entryId', displayName: 'Entry ID', type: 'number', desc: 'ID of the balance history entry to delete' },
			],
		},
		getCryptoSynced: {
			required: [
				{ name: 'cryptoSyncedAccountId', displayName: 'Account ID', type: 'number', desc: 'ID of the synced crypto account' },
				{ name: 'cryptoSyncedSymbol', displayName: 'Symbol', type: 'string', desc: 'Cryptocurrency symbol (e.g. "btc")', placeholder: 'btc' },
			],
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date (YYYY-MM-DD)', placeholder: '2024-12-31' },
			],
		},
		updateCryptoSynced: {
			required: [
				{ name: 'cryptoSyncedAccountId', displayName: 'Account ID', type: 'number', desc: 'ID of the synced crypto account' },
				{ name: 'cryptoSyncedSymbol', displayName: 'Symbol', type: 'string', desc: 'Cryptocurrency symbol (e.g. "btc")', placeholder: 'btc' },
				{ name: 'balanceEntries', displayName: 'Balance Entries (JSON)', type: 'json', desc: 'JSON array of balance entries with date and balance fields' },
			],
		},
		deleteCryptoSynced: {
			required: [
				{ name: 'cryptoSyncedAccountId', displayName: 'Account ID', type: 'number', desc: 'ID of the synced crypto account' },
				{ name: 'cryptoSyncedSymbol', displayName: 'Symbol', type: 'string', desc: 'Cryptocurrency symbol (e.g. "btc")', placeholder: 'btc' },
			],
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date of range to delete (YYYY-MM-DD)' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End date of range to delete (YYYY-MM-DD)' },
			],
		},
		updateDeletedDetails: {
			required: [
				{ name: 'deletedAccountId', displayName: 'Deleted Account ID', type: 'number', desc: 'ID of the deleted account source' },
				{ name: 'detailsData', displayName: 'Details (JSON)', type: 'json', desc: 'JSON object with display_name and/or other metadata fields' },
			],
		},
	},
};

// ── Code generators ──

function toFieldProp(field, resource, operations) {
	const prop = {
		displayName: field.displayName,
		name: field.name,
		type: field.type === 'options' ? 'options' : field.type === 'json' ? 'json' : field.type,
		default: field.type === 'boolean' ? false : field.type === 'number' ? 0 : field.type === 'json' ? '[]' : '',
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
			type: 'number',
			required: true,
			default: 0,
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
						type: f.type === 'options' ? 'options' : f.type,
						default: f.type === 'boolean' ? false : f.type === 'number' ? 0 : '',
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

	// Build body for POST/PUT
	if (op.method === 'POST' || op.method === 'PUT') {
		code += `\t\t\t\t\t\tconst body: IDataObject = {};\n`;

		if (hasRequired) {
			for (const f of opFields.required) {
				if (f.type === 'json') {
					code += `\t\t\t\t\t\tconst ${f.name}Raw = this.getNodeParameter('${f.name}', i) as string;\n`;
					code += `\t\t\t\t\t\ttry { Object.assign(body, { ${f.name === 'splitData' ? 'splits' : f.name}: JSON.parse(${f.name}Raw) }); } catch { throw new Error('Invalid JSON in ${f.displayName}'); }\n`;
				} else if (f.name === 'transaction_ids' || f.name === 'tag_ids') {
					code += `\t\t\t\t\t\tconst ${f.name}Str = this.getNodeParameter('${f.name}', i) as string;\n`;
					code += `\t\t\t\t\t\tbody.${f.name} = ${f.name}Str.split(',').map(s => parseInt(s.trim(), 10));\n`;
				} else {
					code += `\t\t\t\t\t\tbody.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
				}
			}
		}

		if (hasOptional) {
			code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
			// Handle tag_ids conversion if present in optional
			const hasTagIds = opFields.optional.some(f => f.name === 'tag_ids');
			if (hasTagIds) {
				code += `\t\t\t\t\t\tif (additionalFields.tag_ids) {\n`;
				code += `\t\t\t\t\t\t\tadditionalFields.tag_ids = (additionalFields.tag_ids as string).split(',').map(s => parseInt(s.trim(), 10));\n`;
				code += `\t\t\t\t\t\t}\n`;
			}
			code += `\t\t\t\t\t\tObject.assign(body, additionalFields);\n`;
		}

		// Wrap transactions in array for create
		if (resourceKey === 'transaction' && op.value === 'create') {
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, { transactions: [body] });\n`;
		} else {
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, body);\n`;
		}
	} else if (op.method === 'GET') {
		if (hasOptional) {
			code += `\t\t\t\t\t\tconst qs = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
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
			// DELETE with body (like budgets)
			code += `\t\t\t\t\t\tconst body: IDataObject = {};\n`;
			for (const f of opFields.required) {
				code += `\t\t\t\t\t\tbody.${f.name} = this.getNodeParameter('${f.name}', i);\n`;
			}
			if (hasOptional) {
				code += `\t\t\t\t\t\tconst additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;\n`;
				code += `\t\t\t\t\t\tObject.assign(body, additionalFields);\n`;
			}
			code += `\t\t\t\t\t\tresponseData = await lunchMoneyApiRequest.call(this, '${op.method}', \`${apiPath}\`, body);\n`;
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
