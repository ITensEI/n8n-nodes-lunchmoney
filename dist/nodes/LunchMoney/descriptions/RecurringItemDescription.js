"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recurringItemFields = exports.recurringItemOperations = void 0;
exports.recurringItemOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['recurringItem'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a single recurring item by ID',
                action: 'Get a recurring item',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all recurring items',
                action: 'Get many recurring items',
            },
        ],
        default: 'get',
    },
];
exports.recurringItemFields = [
    {
        "displayName": "Recurring Item ID",
        "name": "recurringItemId",
        "type": "number",
        "required": true,
        "default": 0,
        "description": "The ID of the recurring item",
        "displayOptions": {
            "show": {
                "resource": [
                    "recurringItem"
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
                    "recurringItem"
                ],
                "operation": [
                    "getAll"
                ]
            }
        },
        "options": [
            {
                "displayName": "Start Date",
                "name": "start_date",
                "type": "string",
                "default": "",
                "description": "Beginning of the range to populate the matching object (YYYY-MM-DD). Defaults to current month start if omitted.",
                "placeholder": "2024-01-01"
            },
            {
                "displayName": "End Date",
                "name": "end_date",
                "type": "string",
                "default": "",
                "description": "End of the range to populate the matching object (YYYY-MM-DD). Required if start_date is set.",
                "placeholder": "2024-12-31"
            },
            {
                "displayName": "Include Suggested",
                "name": "include_suggested",
                "type": "boolean",
                "default": false,
                "description": "If true, include suggested recurring items that Lunch Money has identified but not yet confirmed."
            }
        ]
    },
];
//# sourceMappingURL=RecurringItemDescription.js.map