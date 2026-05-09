import type { INodeProperties } from 'n8n-workflow';

export const manualAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['manualAccount'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new manual account',
				action: 'Create a manual account',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a manual account',
				action: 'Delete a manual account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single manual account by ID',
				action: 'Get a manual account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all manual accounts',
				action: 'Get many manual accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a manual account',
				action: 'Update a manual account',
			},
		],
		default: 'create',
	},
];

export const manualAccountFields: INodeProperties[] = [
	{
		"displayName": "Account ID",
		"name": "accountId",
		"type": "string",
		"required": true,
		"default": "",
		"description": "The ID of the manual account",
		"displayOptions": {
			"show": {
				"resource": [
					"manualAccount"
				],
				"operation": [
					"get",
					"update",
					"delete"
				]
			}
		}
	},
	{
		"displayName": "Name",
		"name": "name",
		"type": "string",
		"default": "",
		"description": "Name of the manual account.",
		"displayOptions": {
			"show": {
				"resource": [
					"manualAccount"
				],
				"operation": [
					"create"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Account Type",
		"name": "type",
		"type": "options",
		"default": "",
		"description": "The type of the manual account.",
		"displayOptions": {
			"show": {
				"resource": [
					"manualAccount"
				],
				"operation": [
					"create"
				]
			}
		},
		"required": true,
		"options": [
			{
				"name": "Cash",
				"value": "cash"
			},
			{
				"name": "Credit",
				"value": "credit"
			},
			{
				"name": "Investment",
				"value": "investment"
			},
			{
				"name": "Retirement",
				"value": "retirement"
			},
			{
				"name": "Brokerage",
				"value": "brokerage"
			},
			{
				"name": "Other asset",
				"value": "other asset"
			},
			{
				"name": "Other liability",
				"value": "other liability"
			},
			{
				"name": "Loan",
				"value": "loan"
			},
			{
				"name": "Real estate",
				"value": "real estate"
			},
			{
				"name": "Vehicle",
				"value": "vehicle"
			},
			{
				"name": "Cryptocurrency",
				"value": "cryptocurrency"
			},
			{
				"name": "Employee compensation",
				"value": "employee compensation"
			}
		]
	},
	{
		"displayName": "Balance",
		"name": "balance",
		"type": "string",
		"default": "",
		"description": "Current balance as a number or decimal string (up to 4 decimal places).",
		"displayOptions": {
			"show": {
				"resource": [
					"manualAccount"
				],
				"operation": [
					"create"
				]
			}
		},
		"required": true,
		"placeholder": "1000.00"
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
					"manualAccount"
				],
				"operation": [
					"create"
				]
			}
		},
		"options": [
			{
				"displayName": "Currency",
				"name": "currency",
				"type": "string",
				"default": "",
				"description": "Three-letter lowercase ISO 4217 currency code.",
				"placeholder": "usd"
			},
			{
				"displayName": "Institution Name",
				"name": "institution_name",
				"type": "string",
				"default": "",
				"description": "Name of institution holding the account."
			},
			{
				"displayName": "Display Name",
				"name": "display_name",
				"type": "string",
				"default": "",
				"description": "Display name for the account as shown in the app. Derived from institution_name and name if not set."
			},
			{
				"displayName": "Subtype",
				"name": "subtype",
				"type": "string",
				"default": "",
				"description": "Optional account subtype (e.g. \"checking\", \"savings\", \"retirement\")."
			},
			{
				"displayName": "Balance As Of",
				"name": "balance_as_of",
				"type": "string",
				"default": "",
				"description": "Date/time the balance was last updated in ISO 8601 format."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "Status of the account.",
				"options": [
					{
						"name": "Active",
						"value": "active"
					},
					{
						"name": "Closed",
						"value": "closed"
					}
				]
			},
			{
				"displayName": "Closed On",
				"name": "closed_on",
				"type": "string",
				"default": "",
				"description": "Date this account was closed (YYYY-MM-DD). If set, status must also be set to \"closed\"."
			},
			{
				"displayName": "External ID",
				"name": "external_id",
				"type": "string",
				"default": "",
				"description": "Optional user-defined ID for the account."
			},
			{
				"displayName": "Custom Metadata (JSON)",
				"name": "custom_metadata",
				"type": "json",
				"default": "",
				"description": "Optional JSON object with additional data related to this account."
			},
			{
				"displayName": "Exclude From Transactions",
				"name": "exclude_from_transactions",
				"type": "boolean",
				"default": false,
				"description": "If true, transactions may not be created or imported for this account."
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
					"manualAccount"
				],
				"operation": [
					"delete"
				]
			}
		},
		"options": [
			{
				"displayName": "Delete Items",
				"name": "delete_items",
				"type": "boolean",
				"default": false,
				"description": "If true, also delete any transactions, rules, and recurring items associated with this account."
			},
			{
				"displayName": "Delete Balance History",
				"name": "delete_balance_history",
				"type": "boolean",
				"default": false,
				"description": "If true, delete any balance history associated with this account."
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
					"manualAccount"
				],
				"operation": [
					"update"
				]
			}
		},
		"options": [
			{
				"displayName": "Name",
				"name": "name",
				"type": "string",
				"default": "",
				"description": "New name for the account."
			},
			{
				"displayName": "Institution Name",
				"name": "institution_name",
				"type": "string",
				"default": "",
				"description": "New name of the institution holding the account."
			},
			{
				"displayName": "Display Name",
				"name": "display_name",
				"type": "string",
				"default": "",
				"description": "New display name. Must be unique for the user."
			},
			{
				"displayName": "Account Type",
				"name": "type",
				"type": "options",
				"default": "",
				"description": "New type for the account.",
				"options": [
					{
						"name": "Cash",
						"value": "cash"
					},
					{
						"name": "Credit",
						"value": "credit"
					},
					{
						"name": "Investment",
						"value": "investment"
					},
					{
						"name": "Retirement",
						"value": "retirement"
					},
					{
						"name": "Brokerage",
						"value": "brokerage"
					},
					{
						"name": "Other asset",
						"value": "other asset"
					},
					{
						"name": "Other liability",
						"value": "other liability"
					},
					{
						"name": "Loan",
						"value": "loan"
					},
					{
						"name": "Real estate",
						"value": "real estate"
					},
					{
						"name": "Vehicle",
						"value": "vehicle"
					},
					{
						"name": "Cryptocurrency",
						"value": "cryptocurrency"
					},
					{
						"name": "Employee compensation",
						"value": "employee compensation"
					}
				]
			},
			{
				"displayName": "Subtype",
				"name": "subtype",
				"type": "string",
				"default": "",
				"description": "New account subtype (e.g. \"checking\", \"savings\")."
			},
			{
				"displayName": "Balance",
				"name": "balance",
				"type": "string",
				"default": "",
				"description": "New balance as a number or decimal string."
			},
			{
				"displayName": "Currency",
				"name": "currency",
				"type": "string",
				"default": "",
				"description": "New three-letter lowercase ISO 4217 currency code."
			},
			{
				"displayName": "Balance As Of",
				"name": "balance_as_of",
				"type": "string",
				"default": "",
				"description": "New date for the balance timestamp (YYYY-MM-DD or ISO 8601 datetime)."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "New status. If set to \"closed\", closed_on will be set to today if not provided.",
				"options": [
					{
						"name": "Active",
						"value": "active"
					},
					{
						"name": "Closed",
						"value": "closed"
					}
				]
			},
			{
				"displayName": "Closed On",
				"name": "closed_on",
				"type": "string",
				"default": "",
				"description": "Date this account was closed (YYYY-MM-DD). Account must currently be closed or being set to closed."
			},
			{
				"displayName": "External ID",
				"name": "external_id",
				"type": "string",
				"default": "",
				"description": "User-defined external ID."
			},
			{
				"displayName": "Custom Metadata (JSON)",
				"name": "custom_metadata",
				"type": "json",
				"default": "",
				"description": "Optional JSON object with additional data related to this account."
			},
			{
				"displayName": "Exclude From Transactions",
				"name": "exclude_from_transactions",
				"type": "boolean",
				"default": false,
				"description": "If true, transactions may not be created or imported for this account."
			}
		]
	},
];
