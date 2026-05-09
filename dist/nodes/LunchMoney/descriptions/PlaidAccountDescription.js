"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plaidAccountFields = exports.plaidAccountOperations = void 0;
exports.plaidAccountOperations = [
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
exports.plaidAccountFields = [
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
//# sourceMappingURL=PlaidAccountDescription.js.map