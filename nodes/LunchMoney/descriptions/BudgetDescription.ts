import type { INodeProperties } from 'n8n-workflow';

export const budgetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['budget'],
			},
		},
		options: [
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get budget settings',
				action: 'Get budget settings',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove a budget entry',
				action: 'Remove a budget entry',
			},
			{
				name: 'Upsert',
				value: 'upsert',
				description: 'Create or update a budget entry',
				action: 'Upsert a budget entry',
			},
		],
		default: 'getSettings',
	},
];

export const budgetFields: INodeProperties[] = [
	{
		"displayName": "Start Date",
		"name": "start_date",
		"type": "string",
		"default": "",
		"description": "Start date of the budget period to remove (YYYY-MM-DD).",
		"displayOptions": {
			"show": {
				"resource": [
					"budget"
				],
				"operation": [
					"remove"
				]
			}
		},
		"required": true,
		"placeholder": "2024-01-01"
	},
	{
		"displayName": "Category ID",
		"name": "category_id",
		"type": "string",
		"default": "",
		"description": "Category ID of the budget to remove.",
		"displayOptions": {
			"show": {
				"resource": [
					"budget"
				],
				"operation": [
					"remove"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Start Date",
		"name": "start_date",
		"type": "string",
		"default": "",
		"description": "Start date of the budget period (YYYY-MM-DD). Must be a valid budget period start for the account.",
		"displayOptions": {
			"show": {
				"resource": [
					"budget"
				],
				"operation": [
					"upsert"
				]
			}
		},
		"required": true,
		"placeholder": "2024-01-01"
	},
	{
		"displayName": "Category ID",
		"name": "category_id",
		"type": "string",
		"default": "",
		"description": "Category ID for the budget.",
		"displayOptions": {
			"show": {
				"resource": [
					"budget"
				],
				"operation": [
					"upsert"
				]
			}
		},
		"required": true
	},
	{
		"displayName": "Amount",
		"name": "amount",
		"type": "string",
		"default": "",
		"description": "Budget amount as a number or decimal string.",
		"displayOptions": {
			"show": {
				"resource": [
					"budget"
				],
				"operation": [
					"upsert"
				]
			}
		},
		"required": true,
		"placeholder": "500.00"
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
					"budget"
				],
				"operation": [
					"upsert"
				]
			}
		},
		"options": [
			{
				"displayName": "Currency",
				"name": "currency",
				"type": "string",
				"default": "",
				"description": "Three-letter currency code. Defaults to the account primary currency.",
				"placeholder": "usd"
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "Optional notes for the budget period."
			}
		]
	},
];
