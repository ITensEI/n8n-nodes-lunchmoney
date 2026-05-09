"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoFields = exports.cryptoOperations = void 0;
exports.cryptoOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['crypto'],
            },
        },
        options: [
            {
                name: 'Create Manual',
                value: 'createManual',
                description: 'Create a manual crypto account',
                action: 'Create a manual crypto account',
            },
            {
                name: 'Delete Manual',
                value: 'deleteManual',
                description: 'Delete a manual crypto account',
                action: 'Delete a manual crypto account',
            },
            {
                name: 'Get Manual',
                value: 'getManual',
                description: 'Get a manual crypto account by ID',
                action: 'Get a manual crypto account',
            },
            {
                name: 'Get Many Manual',
                value: 'getAllManual',
                description: 'Get all manual crypto accounts',
                action: 'Get many manual crypto accounts',
            },
            {
                name: 'Get Many Synced',
                value: 'getAllSynced',
                description: 'Get all synced crypto accounts',
                action: 'Get many synced crypto accounts',
            },
            {
                name: 'Get Synced',
                value: 'getSynced',
                description: 'Get a synced crypto account by ID',
                action: 'Get a synced crypto account',
            },
            {
                name: 'Get Synced By Symbol',
                value: 'getSyncedBySymbol',
                description: 'Get synced crypto balance for a specific symbol',
                action: 'Get synced crypto by symbol',
            },
            {
                name: 'Refresh Synced',
                value: 'refreshSynced',
                description: 'Refresh balances for a synced crypto account',
                action: 'Refresh synced crypto balances',
            },
            {
                name: 'Update Manual',
                value: 'updateManual',
                description: 'Update a manual crypto account',
                action: 'Update a manual crypto account',
            },
            {
                name: 'Get All (Legacy)',
                value: 'getAllLegacy',
                description: 'Get all cryptocurrencies (legacy endpoint)',
                action: 'Get all cryptocurrencies (legacy)',
            },
        ],
        default: 'createManual',
    },
];
exports.cryptoFields = [
    {
        "displayName": "Crypto Account ID",
        "name": "cryptoId",
        "type": "number",
        "required": true,
        "default": 0,
        "description": "The ID of the crypto",
        "displayOptions": {
            "show": {
                "resource": [
                    "crypto"
                ],
                "operation": [
                    "getManual",
                    "updateManual",
                    "deleteManual",
                    "getSynced",
                    "getSyncedBySymbol",
                    "refreshSynced"
                ]
            }
        }
    },
    {
        "displayName": "Name",
        "name": "name",
        "type": "string",
        "default": "",
        "description": "Name of the crypto account",
        "displayOptions": {
            "show": {
                "resource": [
                    "crypto"
                ],
                "operation": [
                    "createManual"
                ]
            }
        },
        "required": true
    },
    {
        "displayName": "Currency/Symbol",
        "name": "currency",
        "type": "string",
        "default": "",
        "description": "Cryptocurrency symbol (e.g. \"btc\")",
        "displayOptions": {
            "show": {
                "resource": [
                    "crypto"
                ],
                "operation": [
                    "createManual"
                ]
            }
        },
        "required": true,
        "placeholder": "btc"
    },
    {
        "displayName": "Balance",
        "name": "balance",
        "type": "string",
        "default": "",
        "description": "Current balance",
        "displayOptions": {
            "show": {
                "resource": [
                    "crypto"
                ],
                "operation": [
                    "createManual"
                ]
            }
        },
        "required": true,
        "placeholder": "0.5"
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
                    "crypto"
                ],
                "operation": [
                    "createManual"
                ]
            }
        },
        "options": [
            {
                "displayName": "Institution Name",
                "name": "institution_name",
                "type": "string",
                "default": "",
                "description": "Name of the exchange or wallet"
            },
            {
                "displayName": "Notes",
                "name": "notes",
                "type": "string",
                "default": "",
                "description": "Notes about this crypto account"
            }
        ]
    },
    {
        "displayName": "Symbol",
        "name": "cryptoSymbol",
        "type": "string",
        "default": "",
        "description": "Cryptocurrency symbol (e.g. \"btc\")",
        "displayOptions": {
            "show": {
                "resource": [
                    "crypto"
                ],
                "operation": [
                    "getSyncedBySymbol"
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
                    "crypto"
                ],
                "operation": [
                    "updateManual"
                ]
            }
        },
        "options": [
            {
                "displayName": "Name",
                "name": "name",
                "type": "string",
                "default": "",
                "description": "Name of the crypto account"
            },
            {
                "displayName": "Balance",
                "name": "balance",
                "type": "string",
                "default": "",
                "description": "Current balance"
            },
            {
                "displayName": "Currency/Symbol",
                "name": "currency",
                "type": "string",
                "default": "",
                "description": "Cryptocurrency symbol"
            },
            {
                "displayName": "Institution Name",
                "name": "institution_name",
                "type": "string",
                "default": "",
                "description": "Exchange or wallet name"
            },
            {
                "displayName": "Notes",
                "name": "notes",
                "type": "string",
                "default": "",
                "description": "Notes about this account"
            }
        ]
    },
];
//# sourceMappingURL=CryptoDescription.js.map