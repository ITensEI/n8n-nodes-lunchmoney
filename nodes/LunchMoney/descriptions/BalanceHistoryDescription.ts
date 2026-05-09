import type { INodeProperties } from 'n8n-workflow';

export const balanceHistoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['balanceHistory'],
			},
		},
		options: [
			{
				name: 'Delete Entry',
				value: 'deleteEntry',
				description: 'Delete a balance history entry',
				action: 'Delete a balance history entry',
			},
			{
				name: 'Delete For Account',
				value: 'deleteForAccount',
				description: 'Delete balance history for an account',
				action: 'Delete balance history for account',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get balance history overview',
				action: 'Get all balance history',
			},
			{
				name: 'Get For Account',
				value: 'getForAccount',
				description: 'Get balance history for an account',
				action: 'Get balance history for account',
			},
			{
				name: 'Update For Account',
				value: 'updateForAccount',
				description: 'Create or update balance history for an account',
				action: 'Update balance history for account',
			},
			{
				name: 'Get Crypto Synced',
				value: 'getCryptoSynced',
				description: 'Get balance history for a synced crypto account and symbol',
				action: 'Get crypto synced balance history',
			},
			{
				name: 'Update Crypto Synced',
				value: 'updateCryptoSynced',
				description: 'Update balance history for a synced crypto account and symbol',
				action: 'Update crypto synced balance history',
			},
			{
				name: 'Delete Crypto Synced',
				value: 'deleteCryptoSynced',
				description: 'Delete balance history for a synced crypto account and symbol',
				action: 'Delete crypto synced balance history',
			},
			{
				name: 'Update Deleted Details',
				value: 'updateDeletedDetails',
				description: 'Update display details for a deleted account in balance history',
				action: 'Update deleted account details',
			},
		],
		default: 'deleteEntry',
	},
];

export const balanceHistoryFields: INodeProperties[] = [
	{
		"displayName": "Entry ID",
		"name": "entryId",
		"type": "string",
		"default": "",
		"description": "ID of the balance history entry to delete",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteEntry"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Account Type",
		"name": "account_type",
		"type": "options",
		"default": "",
		"description": "Type of account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteForAccount"
				]
			}
		},
		"required": true,
		"options": [
			{
				"name": "Manual",
				"value": "manual"
			},
			{
				"name": "Plaid",
				"value": "plaid"
			},
			{
				"name": "Crypto manual",
				"value": "crypto_manual"
			},
			{
				"name": "Deleted",
				"value": "deleted"
			}
		]
	},
	{
		"displayName": "Account ID",
		"name": "account_id",
		"type": "string",
		"default": "",
		"description": "ID of the account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteForAccount"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Additional Fields",
		"name": "additionalFields",
		"type": "collection",
		"placeholder": "Add Field",
		"default": {},
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteForAccount"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Start date of range to delete (YYYY-MM-DD)"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End date of range to delete (YYYY-MM-DD)"
			}
		]
	},
	{
		"displayName": "Additional Fields",
		"name": "additionalFields",
		"type": "collection",
		"placeholder": "Add Field",
		"default": {},
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getAll"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Start date (YYYY-MM-DD)",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End date (YYYY-MM-DD)",
				"placeholder": "2024-12-31"
			}
		]
	},
	{
		"displayName": "Account Type",
		"name": "account_type",
		"type": "options",
		"default": "",
		"description": "Type of account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getForAccount"
				]
			}
		},
		"required": true,
		"options": [
			{
				"name": "Manual",
				"value": "manual"
			},
			{
				"name": "Plaid",
				"value": "plaid"
			},
			{
				"name": "Crypto manual",
				"value": "crypto_manual"
			},
			{
				"name": "Deleted",
				"value": "deleted"
			}
		]
	},
	{
		"displayName": "Account ID",
		"name": "account_id",
		"type": "string",
		"default": "",
		"description": "ID of the account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getForAccount"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Additional Fields",
		"name": "additionalFields",
		"type": "collection",
		"placeholder": "Add Field",
		"default": {},
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getForAccount"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Start date (YYYY-MM-DD)",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End date (YYYY-MM-DD)",
				"placeholder": "2024-12-31"
			}
		]
	},
	{
		"displayName": "Account Type",
		"name": "account_type",
		"type": "options",
		"default": "",
		"description": "Type of account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateForAccount"
				]
			}
		},
		"required": true,
		"options": [
			{
				"name": "Manual",
				"value": "manual"
			},
			{
				"name": "Plaid",
				"value": "plaid"
			},
			{
				"name": "Crypto manual",
				"value": "crypto_manual"
			},
			{
				"name": "Deleted",
				"value": "deleted"
			}
		]
	},
	{
		"displayName": "Account ID",
		"name": "account_id",
		"type": "string",
		"default": "",
		"description": "ID of the account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateForAccount"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Balance Entries (JSON)",
		"name": "balanceEntries",
		"type": "json",
		"default": "[]",
		"description": "JSON array of balance entries with date and balance fields",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateForAccount"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Account ID",
		"name": "cryptoSyncedAccountId",
		"type": "string",
		"default": "",
		"description": "ID of the synced crypto account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getCryptoSynced"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Symbol",
		"name": "cryptoSyncedSymbol",
		"type": "string",
		"default": "",
		"description": "Cryptocurrency symbol (e.g. \"btc\")",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getCryptoSynced"
				]
			}
		},
		"required": true,
		"placeholder": "btc"
	},
	{
		"displayName": "Additional Fields",
		"name": "additionalFields",
		"type": "collection",
		"placeholder": "Add Field",
		"default": {},
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"getCryptoSynced"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Start date (YYYY-MM-DD)",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End date (YYYY-MM-DD)",
				"placeholder": "2024-12-31"
			}
		]
	},
	{
		"displayName": "Account ID",
		"name": "cryptoSyncedAccountId",
		"type": "string",
		"default": "",
		"description": "ID of the synced crypto account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateCryptoSynced"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Symbol",
		"name": "cryptoSyncedSymbol",
		"type": "string",
		"default": "",
		"description": "Cryptocurrency symbol (e.g. \"btc\")",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateCryptoSynced"
				]
			}
		},
		"required": true,
		"placeholder": "btc"
	},
	{
		"displayName": "Balance Entries (JSON)",
		"name": "balanceEntries",
		"type": "json",
		"default": "[]",
		"description": "JSON array of balance entries with date and balance fields",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateCryptoSynced"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Account ID",
		"name": "cryptoSyncedAccountId",
		"type": "string",
		"default": "",
		"description": "ID of the synced crypto account",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteCryptoSynced"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Symbol",
		"name": "cryptoSyncedSymbol",
		"type": "string",
		"default": "",
		"description": "Cryptocurrency symbol (e.g. \"btc\")",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteCryptoSynced"
				]
			}
		},
		"required": true,
		"placeholder": "btc"
	},
	{
		"displayName": "Additional Fields",
		"name": "additionalFields",
		"type": "collection",
		"placeholder": "Add Field",
		"default": {},
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"deleteCryptoSynced"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Start date of range to delete (YYYY-MM-DD)"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End date of range to delete (YYYY-MM-DD)"
			}
		]
	},
	{
		"displayName": "Deleted Account ID",
		"name": "deletedAccountId",
		"type": "string",
		"default": "",
		"description": "ID of the deleted account source",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateDeletedDetails"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Details (JSON)",
		"name": "detailsData",
		"type": "json",
		"default": "[]",
		"description": "JSON object with display_name and/or other metadata fields",
		"displayOptions": {
			"show": {
				"resource": [
					"balanceHistory"
				],
				"operation": [
					"updateDeletedDetails"
				]
			}
		},
		"required": true
	},
];
