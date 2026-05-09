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
// All names, enums, and descriptions match the live API spec (api-1.json, v2.9.3).

const FIELDS = {
	user: {
		getSummary: {
			required: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start of date range in ISO 8601 date format (YYYY-MM-DD)', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End of date range in ISO 8601 date format (YYYY-MM-DD)', placeholder: '2024-01-31' },
			],
			optional: [
				{ name: 'include_exclude_from_budgets', displayName: 'Include Excluded From Budget', type: 'boolean', desc: 'Include categories that have the "Exclude from Budgets" flag set' },
				{ name: 'include_occurrences', displayName: 'Include Occurrences', type: 'boolean', desc: 'Include an occurrences array for each category showing activity per budget period' },
				{ name: 'include_past_budget_dates', displayName: 'Include Past Budget Dates', type: 'boolean', desc: 'Include three budget occurrences prior to the start date (requires Include Occurrences)' },
				{ name: 'include_totals', displayName: 'Include Totals', type: 'boolean', desc: 'Include a top-level totals section summarising inflow and outflow' },
			],
		},
	},
	category: {
		_idField: { name: 'categoryId', displayName: 'Category ID', ops: ['get', 'update', 'delete'] },
		getAll: {
			optional: [
				{ name: 'format', displayName: 'Format', type: 'options', desc: '"nested" returns grouped categories under their parent; "flattened" returns all at the top level sorted by order', options: ['nested', 'flattened'] },
				{ name: 'is_group', displayName: 'Is Group Filter', type: 'boolean', desc: 'If true, return only category groups. If false, return only non-grouped categories. When set, format is ignored.' },
			],
		},
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the category. Must be between 1 and 100 characters and unique.' },
			],
			optional: [
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the category. Must not exceed 200 characters.' },
				{ name: 'is_income', displayName: 'Is Income', type: 'boolean', desc: 'If true, transactions in this category are treated as income.' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'If true, transactions in this category are excluded from the budget.' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'If true, transactions in this category are excluded from totals.' },
				{ name: 'is_group', displayName: 'Is Group', type: 'boolean', desc: 'If true, the category is created as a category group.' },
				{ name: 'group_id', displayName: 'Group ID', type: 'number', desc: 'If set to the ID of an existing category group, this new category will be assigned to that group. Cannot be set if is_group is true.' },
				{ name: 'archived', displayName: 'Archived', type: 'boolean', desc: 'If true, the category is archived and not displayed in the Lunch Money app.' },
				{ name: 'order', displayName: 'Order', type: 'number', desc: 'Index specifying the display position on the categories page.' },
				{ name: 'collapsed', displayName: 'Collapsed', type: 'boolean', desc: 'If true, the category group appears collapsed in the Lunch Money app. Only applicable to category groups.' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'New name for the category. Must be between 1 and 100 characters.' },
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'New description. Must not exceed 200 characters.' },
				{ name: 'is_income', displayName: 'Is Income', type: 'boolean', desc: 'If set, indicates whether transactions in this category are treated as income.' },
				{ name: 'exclude_from_budget', displayName: 'Exclude From Budget', type: 'boolean', desc: 'If set, indicates whether transactions are excluded from the budget.' },
				{ name: 'exclude_from_totals', displayName: 'Exclude From Totals', type: 'boolean', desc: 'If set, indicates whether transactions are excluded from totals.' },
				{ name: 'group_id', displayName: 'Group ID', type: 'number', desc: 'If set to an existing category group ID, assigns this category to that group.' },
				{ name: 'is_group', displayName: 'Is Group', type: 'boolean', desc: 'May not be changed from the current status of the category.' },
				{ name: 'archived', displayName: 'Archived', type: 'boolean', desc: 'If set, indicates whether the category is archived.' },
				{ name: 'order', displayName: 'Order', type: 'number', desc: 'Index specifying the display position on the categories page.' },
				{ name: 'collapsed', displayName: 'Collapsed', type: 'boolean', desc: 'If true, the category group appears collapsed. Only applicable to category groups.' },
			],
		},
	},
	transaction: {
		_idField: { name: 'transactionId', displayName: 'Transaction ID', ops: ['get', 'update', 'delete', 'split', 'unsplit'] },
		getAll: {
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Beginning of the time period to fetch transactions for (YYYY-MM-DD).', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End of the time period to fetch transactions for (YYYY-MM-DD). Required if start_date is set.', placeholder: '2024-12-31' },
				{ name: 'created_since', displayName: 'Created Since', type: 'string', desc: 'Filter to transactions created after this timestamp. Accepts YYYY-MM-DD or ISO 8601 datetime.', placeholder: '2024-01-01' },
				{ name: 'updated_since', displayName: 'Updated Since', type: 'string', desc: 'Filter to transactions updated after this timestamp. Accepts YYYY-MM-DD or ISO 8601 datetime.', placeholder: '2024-01-01' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Filter to transactions associated with the specified category ID. Also matches category groups. Set to 0 to filter for uncategorized.' },
				{ name: 'tag_id', displayName: 'Tag ID', type: 'number', desc: 'Filter to transactions that have a tag with the specified Tag ID.' },
				{ name: 'recurring_id', displayName: 'Recurring ID', type: 'number', desc: 'Filter to transactions associated with the specified Recurring Item ID.' },
				{ name: 'plaid_account_id', displayName: 'Plaid Account ID', type: 'number', desc: 'Filter to transactions associated with the specified Plaid account ID. Set to 0 to omit Plaid transactions.' },
				{ name: 'manual_account_id', displayName: 'Manual Account ID', type: 'number', desc: 'Filter to transactions associated with the specified manual account ID. Set to 0 to omit manual account transactions.' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Filter to transactions with the specified status.', options: ['reviewed', 'unreviewed', 'delete_pending'] },
				{ name: 'is_group_parent', displayName: 'Is Group Parent', type: 'boolean', desc: 'If true, return only transaction groups (parent transactions).' },
				{ name: 'is_pending', displayName: 'Is Pending', type: 'boolean', desc: 'If true, return only pending transactions. If false, return only non-pending transactions.' },
				{ name: 'include_pending', displayName: 'Include Pending', type: 'boolean', desc: 'By default, pending transactions are excluded. Set to true to include imported transactions with a pending status.' },
				{ name: 'include_metadata', displayName: 'Include Metadata', type: 'boolean', desc: 'If true, include custom and Plaid metadata in the response.' },
				{ name: 'include_split_parents', displayName: 'Include Split Parents', type: 'boolean', desc: 'By default, transactions that were split are not included. Set to true to include them.' },
				{ name: 'include_group_children', displayName: 'Include Group Children', type: 'boolean', desc: 'By default, individual transactions that joined a transaction group are not included. Set to true to include them.' },
				{ name: 'include_children', displayName: 'Include Children', type: 'boolean', desc: 'If true, include the children property containing split or grouped child transactions.' },
				{ name: 'include_files', displayName: 'Include Files', type: 'boolean', desc: 'If true, include the files property containing a list of attached files for each transaction.' },
				{ name: 'limit', displayName: 'Limit', type: 'number', desc: 'Maximum number of transactions to return.' },
				{ name: 'offset', displayName: 'Offset', type: 'number', desc: 'Number of records to skip for pagination.' },
			],
		},
		create: {
			required: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date of the transaction in ISO 8601 format (YYYY-MM-DD).', placeholder: '2024-01-15' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Numeric amount without currency symbol (e.g. 4.25 for $4.25). Negative for credits.', placeholder: '25.00' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'Payee or merchant name.' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'Three-letter lowercase ISO 4217 currency code (e.g. "usd"). Defaults to the account primary currency.', placeholder: 'usd' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Unique identifier of the category to assign.' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes for the transaction.' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Transaction status.', options: ['reviewed', 'unreviewed'] },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'User-defined external ID for deduplication (requires manual_account_id).' },
				{ name: 'manual_account_id', displayName: 'Manual Account ID', type: 'number', desc: 'ID of the manual account to associate with this transaction.' },
				{ name: 'tag_ids', displayName: 'Tag IDs', type: 'string', desc: 'Comma-separated list of tag IDs to assign to the transaction.' },
				{ name: 'recurring_id', displayName: 'Recurring Item ID', type: 'number', desc: 'ID of the recurring item to link to this transaction.' },
				{ name: 'apply_rules', displayName: 'Apply Rules', type: 'boolean', desc: 'If true, any rules associated with the manual_account_id will be applied to the transaction.' },
				{ name: 'skip_duplicates', displayName: 'Skip Duplicates', type: 'boolean', desc: 'If true, flag transactions as duplicates if they share the same date, payee, amount, and account.' },
				{ name: 'skip_balance_update', displayName: 'Skip Balance Update', type: 'boolean', desc: 'If true, the balance of the associated manual account will not be updated.' },
			],
		},
		update: {
			optional: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date of the transaction in ISO 8601 format (YYYY-MM-DD).' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Numeric amount without currency symbol.' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'New payee for the transaction.' },
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'Three-letter lowercase ISO 4217 currency code.' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category to assign. Set to null to clear.' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'New notes. Set to empty string to clear.' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Transaction status.', options: ['reviewed', 'unreviewed'] },
				{ name: 'recurring_id', displayName: 'Recurring Item ID', type: 'number', desc: 'ID of a recurring item to associate. Set to null to clear.' },
				{ name: 'tag_ids', displayName: 'Tag IDs (replace)', type: 'string', desc: 'Comma-separated tag IDs. Overwrites any existing tags on the transaction.' },
				{ name: 'additional_tag_ids', displayName: 'Tag IDs (add)', type: 'string', desc: 'Comma-separated tag IDs to add without replacing existing tags.' },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'User-defined external ID (requires manual_account_id).' },
				{ name: 'manual_account_id', displayName: 'Manual Account ID', type: 'number', desc: 'ID of the manual account. Set to null to disassociate.' },
				{ name: 'update_balance', displayName: 'Update Balance', type: 'boolean', desc: "Set to false to skip updating the account's balance when changing the transaction." },
			],
		},
		createGroup: {
			required: [
				{ name: 'date', displayName: 'Date', type: 'string', desc: 'Date for the new grouped transaction in ISO 8601 format (YYYY-MM-DD).', placeholder: '2024-01-15' },
				{ name: 'payee', displayName: 'Payee', type: 'string', desc: 'Payee for the new grouped transaction.' },
				{ name: 'ids', displayName: 'Transaction IDs', type: 'string', desc: 'Comma-separated list of existing transaction IDs to group. Split and recurring transactions may not be grouped.' },
			],
			optional: [
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'ID of an existing category to assign to the grouped transaction.' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Notes for the grouped transaction.' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Status of the grouped transaction.', options: ['reviewed', 'unreviewed'] },
				{ name: 'tag_ids', displayName: 'Tag IDs', type: 'string', desc: 'Comma-separated list of tag IDs to assign to the grouped transaction.' },
			],
		},
		deleteGroup: {
			required: [
				{ name: 'groupId', displayName: 'Group ID', type: 'number', desc: 'Transaction ID of the group parent to delete.' },
			],
		},
		split: {
			required: [
				{ name: 'child_transactions', displayName: 'Child Transactions (JSON)', type: 'json', desc: 'JSON array of child transactions. The sum of amounts must match the parent transaction amount. Each item needs at minimum an "amount" field.' },
			],
		},
		uploadAttachment: {
			required: [
				{ name: 'uploadTransactionId', displayName: 'Transaction ID', type: 'number', desc: 'ID of the transaction to attach the file to.' },
				{ name: 'fileUrl', displayName: 'File URL', type: 'string', desc: 'URL of the file to attach.' },
			],
			optional: [
				{ name: 'fileName', displayName: 'File Name', type: 'string', desc: 'Name for the attachment file.' },
			],
		},
		getAttachment: {
			required: [
				{ name: 'fileId', displayName: 'File ID', type: 'number', desc: 'ID of the attachment file.' },
			],
		},
		deleteAttachment: {
			required: [
				{ name: 'fileId', displayName: 'File ID', type: 'number', desc: 'ID of the attachment file to delete.' },
			],
		},
	},
	tag: {
		_idField: { name: 'tagId', displayName: 'Tag ID', ops: ['get', 'update', 'delete'] },
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the tag. Must be between 1 and 100 characters and must not match any existing tag name.' },
			],
			optional: [
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'Description of the tag. Must not exceed 200 characters.' },
				{ name: 'text_color', displayName: 'Text Color', type: 'string', desc: 'Text color for the tag (e.g. "#ffffff").' },
				{ name: 'background_color', displayName: 'Background Color', type: 'string', desc: 'Background color for the tag (e.g. "#1a73e8").' },
				{ name: 'archived', displayName: 'Archived', type: 'boolean', desc: 'If true, the tag is archived and not displayed in the Lunch Money app.' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'New name for the tag. Must be between 1 and 100 characters.' },
				{ name: 'description', displayName: 'Description', type: 'string', desc: 'New description. Must not exceed 200 characters.' },
				{ name: 'text_color', displayName: 'Text Color', type: 'string', desc: 'Text color for the tag (e.g. "#ffffff").' },
				{ name: 'background_color', displayName: 'Background Color', type: 'string', desc: 'Background color for the tag (e.g. "#1a73e8").' },
				{ name: 'archived', displayName: 'Archived', type: 'boolean', desc: 'If set, indicates whether the tag is archived.' },
			],
		},
	},
	recurringItem: {
		_idField: { name: 'recurringItemId', displayName: 'Recurring Item ID', ops: ['get'] },
		getAll: {
			optional: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Beginning of the range to populate the matching object (YYYY-MM-DD). Defaults to current month start if omitted.', placeholder: '2024-01-01' },
				{ name: 'end_date', displayName: 'End Date', type: 'string', desc: 'End of the range to populate the matching object (YYYY-MM-DD). Required if start_date is set.', placeholder: '2024-12-31' },
				{ name: 'include_suggested', displayName: 'Include Suggested', type: 'boolean', desc: 'If true, include suggested recurring items that Lunch Money has identified but not yet confirmed.' },
			],
		},
	},
	budget: {
		getSettings: {},
		upsert: {
			required: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date of the budget period (YYYY-MM-DD). Must be a valid budget period start for the account.', placeholder: '2024-01-01' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category ID for the budget.' },
				{ name: 'amount', displayName: 'Amount', type: 'string', desc: 'Budget amount as a number or decimal string.', placeholder: '500.00' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'Three-letter currency code. Defaults to the account primary currency.', placeholder: 'usd' },
				{ name: 'notes', displayName: 'Notes', type: 'string', desc: 'Optional notes for the budget period.' },
			],
		},
		remove: {
			// DELETE /budgets uses query string params, not a request body
			_useQs: true,
			required: [
				{ name: 'start_date', displayName: 'Start Date', type: 'string', desc: 'Start date of the budget period to remove (YYYY-MM-DD).', placeholder: '2024-01-01' },
				{ name: 'category_id', displayName: 'Category ID', type: 'number', desc: 'Category ID of the budget to remove.' },
			],
		},
	},
	manualAccount: {
		_idField: { name: 'accountId', displayName: 'Account ID', ops: ['get', 'update', 'delete'] },
		create: {
			required: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'Name of the manual account.' },
				{ name: 'type', displayName: 'Account Type', type: 'options', desc: 'The type of the manual account.', options: ['cash', 'credit', 'investment', 'retirement', 'brokerage', 'other asset', 'other liability', 'loan', 'real estate', 'vehicle', 'cryptocurrency', 'employee compensation'] },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'Current balance as a number or decimal string (up to 4 decimal places).', placeholder: '1000.00' },
			],
			optional: [
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'Three-letter lowercase ISO 4217 currency code.', placeholder: 'usd' },
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'Name of institution holding the account.' },
				{ name: 'display_name', displayName: 'Display Name', type: 'string', desc: 'Display name for the account as shown in the app. Derived from institution_name and name if not set.' },
				{ name: 'subtype', displayName: 'Subtype', type: 'string', desc: 'Optional account subtype (e.g. "checking", "savings", "retirement").' },
				{ name: 'balance_as_of', displayName: 'Balance As Of', type: 'string', desc: 'Date/time the balance was last updated in ISO 8601 format.' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'Status of the account.', options: ['active', 'closed'] },
				{ name: 'closed_on', displayName: 'Closed On', type: 'string', desc: 'Date this account was closed (YYYY-MM-DD). If set, status must also be set to "closed".' },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'Optional user-defined ID for the account.' },
				{ name: 'exclude_from_transactions', displayName: 'Exclude From Transactions', type: 'boolean', desc: 'If true, transactions may not be created or imported for this account.' },
			],
		},
		update: {
			optional: [
				{ name: 'name', displayName: 'Name', type: 'string', desc: 'New name for the account.' },
				{ name: 'institution_name', displayName: 'Institution Name', type: 'string', desc: 'New name of the institution holding the account.' },
				{ name: 'display_name', displayName: 'Display Name', type: 'string', desc: 'New display name. Must be unique for the user.' },
				{ name: 'type', displayName: 'Account Type', type: 'options', desc: 'New type for the account.', options: ['cash', 'credit', 'investment', 'retirement', 'brokerage', 'other asset', 'other liability', 'loan', 'real estate', 'vehicle', 'cryptocurrency', 'employee compensation'] },
				{ name: 'subtype', displayName: 'Subtype', type: 'string', desc: 'New account subtype (e.g. "checking", "savings").' },
				{ name: 'balance', displayName: 'Balance', type: 'string', desc: 'New balance as a number or decimal string.' },
				{ name: 'currency', displayName: 'Currency', type: 'string', desc: 'New three-letter lowercase ISO 4217 currency code.' },
				{ name: 'balance_as_of', displayName: 'Balance As Of', type: 'string', desc: 'New date for the balance timestamp (YYYY-MM-DD or ISO 8601 datetime).' },
				{ name: 'status', displayName: 'Status', type: 'options', desc: 'New status. If set to "closed", closed_on will be set to today if not provided.', options: ['active', 'closed'] },
				{ name: 'closed_on', displayName: 'Closed On', type: 'string', desc: 'Date this account was closed (YYYY-MM-DD). Account must currently be closed or being set to closed.' },
				{ name: 'external_id', displayName: 'External ID', type: 'string', desc: 'User-defined external ID.' },
				{ name: 'exclude_from_transactions', displayName: 'Exclude From Transactions', type: 'boolean', desc: 'If true, transactions may not be created or imported for this account.' },
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

	// Array fields that must be converted from comma-separated strings to int arrays
	const ARRAY_INT_FIELDS = new Set(['ids', 'tag_ids', 'additional_tag_ids']);

	// Fields that are query params even on PUT/POST (e.g. update_balance on PUT /transactions/{id})
	const QS_ON_MUTATION = new Set(['update_balance']);

	// Build body for POST/PUT
	if (op.method === 'POST' || op.method === 'PUT') {
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
