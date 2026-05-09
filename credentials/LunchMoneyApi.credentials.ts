import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LunchMoneyApi implements ICredentialType {
	name = 'lunchMoneyApi';
	displayName = 'Lunch Money API';
	documentationUrl = 'https://alpha.lunchmoney.dev/v2/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Lunch Money API access token from the developers page',
		},
		{
			displayName: 'Use Mock Server',
			name: 'useMockServer',
			type: 'boolean',
			default: false,
			description:
				'Whether to use the static mock API server instead of the live API. Useful for testing without affecting real data.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.useMockServer ? "https://lm-v2-api-next-a7fabcab8e9a.herokuapp.com/v2" : "https://api.lunchmoney.dev/v2"}}',
			url: '/me',
		},
	};
}
