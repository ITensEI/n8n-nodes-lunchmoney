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
];
