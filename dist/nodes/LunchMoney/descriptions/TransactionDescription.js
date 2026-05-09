"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFields = exports.transactionOperations = void 0;
exports.transactionOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['transaction'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create one or more transactions',
                action: 'Create transactions',
            },
            {
                name: 'Create Group',
                value: 'createGroup',
                description: 'Group multiple transactions',
                action: 'Create a transaction group',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a single transaction',
                action: 'Delete a transaction',
            },
            {
                name: 'Delete Attachment',
                value: 'deleteAttachment',
                description: 'Delete a transaction attachment',
                action: 'Delete a transaction attachment',
            },
            {
                name: 'Delete Group',
                value: 'deleteGroup',
                description: 'Delete a transaction group',
                action: 'Delete a transaction group',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a single transaction by ID',
                action: 'Get a transaction',
            },
            {
                name: 'Get Attachment',
                value: 'getAttachment',
                description: 'Get a transaction attachment',
                action: 'Get a transaction attachment',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all transactions with optional filters',
                action: 'Get many transactions',
            },
            {
                name: 'Split',
                value: 'split',
                description: 'Split a transaction into parts',
                action: 'Split a transaction',
            },
            {
                name: 'Unsplit',
                value: 'unsplit',
                description: 'Remove split from a transaction',
                action: 'Unsplit a transaction',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a single transaction',
                action: 'Update a transaction',
            },
            {
                name: 'Upload Attachment',
                value: 'uploadAttachment',
                description: 'Upload an attachment to a transaction',
                action: 'Upload a transaction attachment',
            },
        ],
        default: 'create',
    },
];
exports.transactionFields = [
    {
        "displayName": "Transaction ID",
        "name": "transactionId",
        "type": "number",
        "required": true,
        "default": 0,
        "description": "The ID of the transaction",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "get",
                    "update",
                    "delete",
                    "split",
                    "unsplit"
                ]
            }
        }
    },
    {
        "displayName": "Date",
        "name": "date",
        "type": "string",
        "default": "",
        "description": "Date of the transaction (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "create"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-15"
    },
    {
        "displayName": "Amount",
        "name": "amount",
        "type": "string",
        "default": "",
        "description": "Amount as a decimal string (e.g. \"25.00\")",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "create"
                ]
            }
        },
        "required": true,
        "placeholder": "25.00"
    },
    {
        "displayName": "Payee",
        "name": "payee",
        "type": "string",
        "default": "",
        "description": "Payee or merchant name",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "create"
                ]
            }
        },
        "required": true
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
                    "transaction"
                ],
                "operation": [
                    "create"
                ]
            }
        },
        "options": [
            {
                "displayName": "Currency",
                "name": "currency",
                "type": "string",
                "default": "",
                "description": "ISO 4217 currency code (e.g. \"usd\")",
                "placeholder": "usd"
            },
            {
                "displayName": "Category ID",
                "name": "category_id",
                "type": "number",
                "default": 0,
                "description": "Category to assign"
            },
            {
                "displayName": "Notes",
                "name": "notes",
                "type": "string",
                "default": "",
                "description": "Transaction notes"
            },
            {
                "displayName": "Status",
                "name": "status",
                "type": "options",
                "default": "",
                "description": "Transaction status",
                "options": [
                    {
                        "name": "Cleared",
                        "value": "cleared"
                    },
                    {
                        "name": "Uncleared",
                        "value": "uncleared"
                    }
                ]
            },
            {
                "displayName": "External ID",
                "name": "external_id",
                "type": "string",
                "default": "",
                "description": "External ID for deduplication"
            },
            {
                "displayName": "Manual Account ID",
                "name": "manual_account_id",
                "type": "number",
                "default": 0,
                "description": "Manual account to associate with"
            },
            {
                "displayName": "Tag IDs",
                "name": "tag_ids",
                "type": "string",
                "default": "",
                "description": "Comma-separated list of tag IDs to assign"
            },
            {
                "displayName": "Recurring Item ID",
                "name": "recurring_id",
                "type": "number",
                "default": 0,
                "description": "Recurring item to link to"
            }
        ]
    },
    {
        "displayName": "Date",
        "name": "date",
        "type": "string",
        "default": "",
        "description": "Date for the group transaction (YYYY-MM-DD)",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "createGroup"
                ]
            }
        },
        "required": true,
        "placeholder": "2024-01-15"
    },
    {
        "displayName": "Payee",
        "name": "payee",
        "type": "string",
        "default": "",
        "description": "Payee for the group transaction",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "createGroup"
                ]
            }
        },
        "required": true
    },
    {
        "displayName": "Transaction IDs",
        "name": "transaction_ids",
        "type": "string",
        "default": "",
        "description": "Comma-separated list of transaction IDs to group",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "createGroup"
                ]
            }
        },
        "required": true
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
                    "transaction"
                ],
                "operation": [
                    "createGroup"
                ]
            }
        },
        "options": [
            {
                "displayName": "Category ID",
                "name": "category_id",
                "type": "number",
                "default": 0,
                "description": "Category for the group"
            },
            {
                "displayName": "Notes",
                "name": "notes",
                "type": "string",
                "default": "",
                "description": "Notes for the group"
            },
            {
                "displayName": "Tag IDs",
                "name": "tag_ids",
                "type": "string",
                "default": "",
                "description": "Comma-separated tag IDs"
            }
        ]
    },
    {
        "displayName": "File ID",
        "name": "fileId",
        "type": "number",
        "default": 0,
        "description": "ID of the attachment file to delete",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "deleteAttachment"
                ]
            }
        },
        "required": true
    },
    {
        "displayName": "Group ID",
        "name": "groupId",
        "type": "number",
        "default": 0,
        "description": "ID of the group to delete",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "deleteGroup"
                ]
            }
        },
        "required": true
    },
    {
        "displayName": "File ID",
        "name": "fileId",
        "type": "number",
        "default": 0,
        "description": "ID of the attachment file",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "getAttachment"
                ]
            }
        },
        "required": true
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
                    "transaction"
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
                "description": "Filter by start date (YYYY-MM-DD)",
                "placeholder": "2024-01-01"
            },
            {
                "displayName": "End Date",
                "name": "end_date",
                "type": "string",
                "default": "",
                "description": "Filter by end date (YYYY-MM-DD)",
                "placeholder": "2024-12-31"
            },
            {
                "displayName": "Category ID",
                "name": "category_id",
                "type": "number",
                "default": 0,
                "description": "Filter by category ID"
            },
            {
                "displayName": "Tag ID",
                "name": "tag_id",
                "type": "number",
                "default": 0,
                "description": "Filter by tag ID"
            },
            {
                "displayName": "Recurring ID",
                "name": "recurring_id",
                "type": "number",
                "default": 0,
                "description": "Filter by recurring item ID"
            },
            {
                "displayName": "Plaid Account ID",
                "name": "plaid_account_id",
                "type": "number",
                "default": 0,
                "description": "Filter by Plaid account ID"
            },
            {
                "displayName": "Manual Account ID",
                "name": "manual_account_id",
                "type": "number",
                "default": 0,
                "description": "Filter by manual account ID"
            },
            {
                "displayName": "Status",
                "name": "status",
                "type": "options",
                "default": "",
                "description": "Filter by status",
                "options": [
                    {
                        "name": "Cleared",
                        "value": "cleared"
                    },
                    {
                        "name": "Uncleared",
                        "value": "uncleared"
                    },
                    {
                        "name": "Reviewed",
                        "value": "reviewed"
                    },
                    {
                        "name": "Pending",
                        "value": "pending"
                    }
                ]
            },
            {
                "displayName": "Is Group",
                "name": "is_group",
                "type": "boolean",
                "default": false,
                "description": "Filter for group parent transactions only"
            },
            {
                "displayName": "Has Notes",
                "name": "has_notes",
                "type": "boolean",
                "default": false,
                "description": "Filter for transactions with notes"
            },
            {
                "displayName": "Has Attachments",
                "name": "has_attachments",
                "type": "boolean",
                "default": false,
                "description": "Filter for transactions with attachments"
            },
            {
                "displayName": "Offset",
                "name": "offset",
                "type": "number",
                "default": 0,
                "description": "Number of records to skip for pagination"
            },
            {
                "displayName": "Limit",
                "name": "limit",
                "type": "number",
                "default": 0,
                "description": "Maximum number of records to return"
            }
        ]
    },
    {
        "displayName": "Split Parts (JSON)",
        "name": "splitData",
        "type": "json",
        "default": "[]",
        "description": "JSON array of split parts, each with amount and optionally category_id, payee, notes",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "split"
                ]
            }
        },
        "required": true
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
                    "transaction"
                ],
                "operation": [
                    "update"
                ]
            }
        },
        "options": [
            {
                "displayName": "Date",
                "name": "date",
                "type": "string",
                "default": "",
                "description": "Date of the transaction (YYYY-MM-DD)"
            },
            {
                "displayName": "Amount",
                "name": "amount",
                "type": "string",
                "default": "",
                "description": "Amount as a decimal string"
            },
            {
                "displayName": "Payee",
                "name": "payee",
                "type": "string",
                "default": "",
                "description": "Payee or merchant name"
            },
            {
                "displayName": "Currency",
                "name": "currency",
                "type": "string",
                "default": "",
                "description": "ISO 4217 currency code"
            },
            {
                "displayName": "Category ID",
                "name": "category_id",
                "type": "number",
                "default": 0,
                "description": "Category to assign"
            },
            {
                "displayName": "Notes",
                "name": "notes",
                "type": "string",
                "default": "",
                "description": "Transaction notes"
            },
            {
                "displayName": "Status",
                "name": "status",
                "type": "options",
                "default": "",
                "description": "Transaction status",
                "options": [
                    {
                        "name": "Cleared",
                        "value": "cleared"
                    },
                    {
                        "name": "Uncleared",
                        "value": "uncleared"
                    },
                    {
                        "name": "Reviewed",
                        "value": "reviewed"
                    }
                ]
            },
            {
                "displayName": "External ID",
                "name": "external_id",
                "type": "string",
                "default": "",
                "description": "External identifier"
            },
            {
                "displayName": "Tag IDs",
                "name": "tag_ids",
                "type": "string",
                "default": "",
                "description": "Comma-separated list of tag IDs"
            }
        ]
    },
    {
        "displayName": "Transaction ID",
        "name": "uploadTransactionId",
        "type": "number",
        "default": 0,
        "description": "ID of the transaction to attach the file to",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "uploadAttachment"
                ]
            }
        },
        "required": true
    },
    {
        "displayName": "File URL",
        "name": "fileUrl",
        "type": "string",
        "default": "",
        "description": "URL of the file to attach",
        "displayOptions": {
            "show": {
                "resource": [
                    "transaction"
                ],
                "operation": [
                    "uploadAttachment"
                ]
            }
        },
        "required": true
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
                    "transaction"
                ],
                "operation": [
                    "uploadAttachment"
                ]
            }
        },
        "options": [
            {
                "displayName": "File Name",
                "name": "fileName",
                "type": "string",
                "default": "",
                "description": "Name for the attachment file"
            }
        ]
    },
];
//# sourceMappingURL=TransactionDescription.js.map