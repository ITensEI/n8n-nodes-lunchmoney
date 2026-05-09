import type { INodeProperties } from 'n8n-workflow';

export const plaidAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['plaidAccount'],
			},
		},
		options: [
			{
				name: 'Fetch Latest',
				value: 'fetch',
				description: 'Trigger a fetch of latest data from Plaid',
				action: 'Fetch latest Plaid data',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single Plaid account by ID',
				action: 'Get a Plaid account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all Plaid accounts',
				action: 'Get many Plaid accounts',
			},
		],
		default: 'fetch',
	},
];

export const plaidAccountFields: INodeProperties[] = [
	{
		"displayName": "Plaid Account ID",
		"name": "plaidAccountId",
		"type": "string",
		"required": true,
		"default": "",
		"description": "The ID of the plaid account",
		"displayOptions": {
			"show": {
				"resource": [
					"plaidAccount"
				],
				"operation": [
					"get"
				]
			}
		}
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
					"plaidAccount"
				],
				"operation": [
					"fetch"
				]
			}
		},
		"options": [
			{
				"displayName": "Start Date",
				"name": "start_date",
				"type": "string",
				"default": "",
				"description": "Beginning of the time period to fetch transactions for (YYYY-MM-DD). If omitted, the most recent transactions are returned.",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "End Date",
				"name": "end_date",
				"type": "string",
				"default": "",
				"description": "End of the time period to fetch transactions for (YYYY-MM-DD). Required if start_date is set.",
				"placeholder": "2024-12-31"
			},
			{
				"displayName": "Plaid Account ID",
				"name": "id",
				"type": "string",
				"default": "",
				"description": "Specific Plaid account ID to fetch. If not set, triggers a fetch for all eligible accounts."
			}
		]
	},
];
