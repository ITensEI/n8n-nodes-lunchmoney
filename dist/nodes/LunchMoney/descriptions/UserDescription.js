"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFields = exports.userOperations = void 0;
exports.userOperations = [
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
exports.userFields = [
    {
        "displayName": "Start Date",
        "name": "start_date",
        "type": "string",
        "default": "",
        "description": "Start of date range (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-01"
    },
    {
        "displayName": "End Date",
        "name": "end_date",
        "type": "string",
        "default": "",
        "description": "End of date range (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-31"
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
                    "user"
                ],
                "operation": [
                    "getSummary"
                ]
            }
        },
        "options": [
            {
                "displayName": "Include Excluded From Budget",
                "name": "include_exclude_from_budgets",
                "type": "boolean",
                "default": false,
                "description": "Include categories with the \"Exclude from Budgets\" flag"
            },
            {
                "displayName": "Include Occurrences",
                "name": "include_occurrences",
                "type": "boolean",
                "default": false,
                "description": "Include an occurrences array for each category in aligned responses"
            },
            {
                "displayName": "Include Past Budget Dates",
                "name": "include_past_budget_dates",
                "type": "boolean",
                "default": false,
                "description": "Include the three budget occurrences prior to the start date (requires include_occurrences)"
            },
            {
                "displayName": "Include Totals",
                "name": "include_totals",
                "type": "boolean",
                "default": false,
                "description": "Include a top-level totals section summarising inflow and outflow"
            }
        ]
    },
];
//# sourceMappingURL=UserDescription.js.map