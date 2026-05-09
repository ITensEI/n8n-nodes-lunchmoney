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
		"type": "number",
		"required": true,
		"default": 0,
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
		"description": "Name of the account",
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
		"name": "type_name",
		"type": "options",
		"default": "",
		"description": "Type of the account",
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
				"name": "Real estate",
				"value": "real estate"
			},
			{
				"name": "Loan",
				"value": "loan"
			},
			{
				"name": "Vehicle",
				"value": "vehicle"
			},
			{
				"name": "Other liability",
				"value": "other liability"
			},
			{
				"name": "Other asset",
				"value": "other asset"
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
		"description": "Current balance as decimal string",
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
				"description": "ISO 4217 currency code",
				"placeholder": "usd"
			},
			{
				"displayName": "Institution Name",
				"name": "institution_name",
				"type": "string",
				"default": "",
				"description": "Name of the financial institution"
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "Notes about the account"
			},
			{
				"displayName": "Closed",
				"name": "closed",
				"type": "boolean",
				"default": false,
				"description": "Whether the account is closed"
			},
			{
				"displayName": "Exclude From Budget",
				"name": "exclude_from_budget",
				"type": "boolean",
				"default": false,
				"description": "Whether to exclude from budget"
			},
			{
				"displayName": "Exclude From Totals",
				"name": "exclude_from_totals",
				"type": "boolean",
				"default": false,
				"description": "Whether to exclude from totals"
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
				"description": "Name of the account"
			},
			{
				"displayName": "Balance",
				"name": "balance",
				"type": "string",
				"default": "",
				"description": "Current balance as decimal string"
			},
			{
				"displayName": "Currency",
				"name": "currency",
				"type": "string",
				"default": "",
				"description": "ISO 4217 currency code"
			},
			{
				"displayName": "Institution Name",
				"name": "institution_name",
				"type": "string",
				"default": "",
				"description": "Name of the financial institution"
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "Notes about the account"
			},
			{
				"displayName": "Closed",
				"name": "closed",
				"type": "boolean",
				"default": false,
				"description": "Whether the account is closed"
			},
			{
				"displayName": "Exclude From Budget",
				"name": "exclude_from_budget",
				"type": "boolean",
				"default": false,
				"description": "Whether to exclude from budget"
			},
			{
				"displayName": "Exclude From Totals",
				"name": "exclude_from_totals",
				"type": "boolean",
				"default": false,
				"description": "Whether to exclude from totals"
			}
		]
	},
];
