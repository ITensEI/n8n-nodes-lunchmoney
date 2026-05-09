"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LunchMoneyApi = void 0;
class LunchMoneyApi {
    constructor() {
        this.name = 'lunchMoneyApi';
        this.displayName = 'Lunch Money API';
        this.documentationUrl = 'https://alpha.lunchmoney.dev/v2/docs';
        this.properties = [
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
                description: 'Whether to use the static mock API server instead of the live API. Useful for testing without affecting real data.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiToken}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.useMockServer ? "https://lm-v2-api-next-a7fabcab8e9a.herokuapp.com/v2" : "https://api.lunchmoney.dev/v2"}}',
                url: '/me',
            },
        };
    }
}
exports.LunchMoneyApi = LunchMoneyApi;
//# sourceMappingURL=LunchMoneyApi.credentials.js.map