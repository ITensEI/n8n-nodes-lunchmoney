import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get Current User',
				value: 'get',
				description: 'Get details about the current user',
				action: 'Get current user',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: 'Get a summary of the user account',
				action: 'Get account summary',
			},
		],
		default: 'get',
	},
];

export const userFields: INodeProperties[] = [
];
