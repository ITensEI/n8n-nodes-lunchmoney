import type { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
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

export const transactionFields: INodeProperties[] = [
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
		"description": "Date of the transaction in ISO 8601 format (YYYY-MM-DD).",
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
		"description": "Numeric amount without currency symbol (e.g. 4.25 for $4.25). Negative for credits.",
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
		"description": "Payee or merchant name.",
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
				"description": "Three-letter lowercase ISO 4217 currency code (e.g. \"usd\"). Defaults to the account primary currency.",
				"placeholder": "usd"
			},
			{
				"displayName": "Category ID",
				"name": "category_id",
				"type": "number",
				"default": 0,
				"description": "Unique identifier of the category to assign."
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "Notes for the transaction."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "Transaction status.",
				"options": [
					{
						"name": "Reviewed",
						"value": "reviewed"
					},
					{
						"name": "Unreviewed",
						"value": "unreviewed"
					}
				]
			},
			{
				"displayName": "External ID",
				"name": "external_id",
				"type": "string",
				"default": "",
				"description": "User-defined external ID for deduplication (requires manual_account_id)."
			},
			{
				"displayName": "Manual Account ID",
				"name": "manual_account_id",
				"type": "number",
				"default": 0,
				"description": "ID of the manual account to associate with this transaction."
			},
			{
				"displayName": "Tag IDs",
				"name": "tag_ids",
				"type": "string",
				"default": "",
				"description": "Comma-separated list of tag IDs to assign to the transaction."
			},
			{
				"displayName": "Recurring Item ID",
				"name": "recurring_id",
				"type": "number",
				"default": 0,
				"description": "ID of the recurring item to link to this transaction."
			},
			{
				"displayName": "Apply Rules",
				"name": "apply_rules",
				"type": "boolean",
				"default": false,
				"description": "If true, any rules associated with the manual_account_id will be applied to the transaction."
			},
			{
				"displayName": "Skip Duplicates",
				"name": "skip_duplicates",
				"type": "boolean",
				"default": false,
				"description": "If true, flag transactions as duplicates if they share the same date, payee, amount, and account."
			},
			{
				"displayName": "Skip Balance Update",
				"name": "skip_balance_update",
				"type": "boolean",
				"default": false,
				"description": "If true, the balance of the associated manual account will not be updated."
			}
		]
	},
	{
		"displayName": "Date",
		"name": "date",
		"type": "string",
		"default": "",
		"description": "Date for the new grouped transaction in ISO 8601 format (YYYY-MM-DD).",
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
		"description": "Payee for the new grouped transaction.",
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
		"name": "ids",
		"type": "string",
		"default": "",
		"description": "Comma-separated list of existing transaction IDs to group. Split and recurring transactions may not be grouped.",
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
				"description": "ID of an existing category to assign to the grouped transaction."
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "Notes for the grouped transaction."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "Status of the grouped transaction.",
				"options": [
					{
						"name": "Reviewed",
						"value": "reviewed"
					},
					{
						"name": "Unreviewed",
						"value": "unreviewed"
					}
				]
			},
			{
				"displayName": "Tag IDs",
				"name": "tag_ids",
				"type": "string",
				"default": "",
				"description": "Comma-separated list of tag IDs to assign to the grouped transaction."
			}
		]
	},
	{
		"displayName": "File ID",
		"name": "fileId",
		"type": "number",
		"default": 0,
		"description": "ID of the attachment file to delete.",
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
		"description": "Transaction ID of the group parent to delete.",
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
		"description": "ID of the attachment file.",
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
				"description": "Beginning of the time period to fetch transactions for (YYYY-MM-DD).",
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
				"displayName": "Created Since",
				"name": "created_since",
				"type": "string",
				"default": "",
				"description": "Filter to transactions created after this timestamp. Accepts YYYY-MM-DD or ISO 8601 datetime.",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "Updated Since",
				"name": "updated_since",
				"type": "string",
				"default": "",
				"description": "Filter to transactions updated after this timestamp. Accepts YYYY-MM-DD or ISO 8601 datetime.",
				"placeholder": "2024-01-01"
			},
			{
				"displayName": "Category ID",
				"name": "category_id",
				"type": "number",
				"default": 0,
				"description": "Filter to transactions associated with the specified category ID. Also matches category groups. Set to 0 to filter for uncategorized."
			},
			{
				"displayName": "Tag ID",
				"name": "tag_id",
				"type": "number",
				"default": 0,
				"description": "Filter to transactions that have a tag with the specified Tag ID."
			},
			{
				"displayName": "Recurring ID",
				"name": "recurring_id",
				"type": "number",
				"default": 0,
				"description": "Filter to transactions associated with the specified Recurring Item ID."
			},
			{
				"displayName": "Plaid Account ID",
				"name": "plaid_account_id",
				"type": "number",
				"default": 0,
				"description": "Filter to transactions associated with the specified Plaid account ID. Set to 0 to omit Plaid transactions."
			},
			{
				"displayName": "Manual Account ID",
				"name": "manual_account_id",
				"type": "number",
				"default": 0,
				"description": "Filter to transactions associated with the specified manual account ID. Set to 0 to omit manual account transactions."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "Filter to transactions with the specified status.",
				"options": [
					{
						"name": "Reviewed",
						"value": "reviewed"
					},
					{
						"name": "Unreviewed",
						"value": "unreviewed"
					},
					{
						"name": "Delete pending",
						"value": "delete_pending"
					}
				]
			},
			{
				"displayName": "Is Group Parent",
				"name": "is_group_parent",
				"type": "boolean",
				"default": false,
				"description": "If true, return only transaction groups (parent transactions)."
			},
			{
				"displayName": "Is Pending",
				"name": "is_pending",
				"type": "boolean",
				"default": false,
				"description": "If true, return only pending transactions. If false, return only non-pending transactions."
			},
			{
				"displayName": "Include Pending",
				"name": "include_pending",
				"type": "boolean",
				"default": false,
				"description": "By default, pending transactions are excluded. Set to true to include imported transactions with a pending status."
			},
			{
				"displayName": "Include Metadata",
				"name": "include_metadata",
				"type": "boolean",
				"default": false,
				"description": "If true, include custom and Plaid metadata in the response."
			},
			{
				"displayName": "Include Split Parents",
				"name": "include_split_parents",
				"type": "boolean",
				"default": false,
				"description": "By default, transactions that were split are not included. Set to true to include them."
			},
			{
				"displayName": "Include Group Children",
				"name": "include_group_children",
				"type": "boolean",
				"default": false,
				"description": "By default, individual transactions that joined a transaction group are not included. Set to true to include them."
			},
			{
				"displayName": "Include Children",
				"name": "include_children",
				"type": "boolean",
				"default": false,
				"description": "If true, include the children property containing split or grouped child transactions."
			},
			{
				"displayName": "Include Files",
				"name": "include_files",
				"type": "boolean",
				"default": false,
				"description": "If true, include the files property containing a list of attached files for each transaction."
			},
			{
				"displayName": "Limit",
				"name": "limit",
				"type": "number",
				"default": 0,
				"description": "Maximum number of transactions to return."
			},
			{
				"displayName": "Offset",
				"name": "offset",
				"type": "number",
				"default": 0,
				"description": "Number of records to skip for pagination."
			}
		]
	},
	{
		"displayName": "Child Transactions (JSON)",
		"name": "child_transactions",
		"type": "json",
		"default": "[]",
		"description": "JSON array of child transactions. The sum of amounts must match the parent transaction amount. Each item needs at minimum an \"amount\" field.",
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
				"description": "Date of the transaction in ISO 8601 format (YYYY-MM-DD)."
			},
			{
				"displayName": "Amount",
				"name": "amount",
				"type": "string",
				"default": "",
				"description": "Numeric amount without currency symbol."
			},
			{
				"displayName": "Payee",
				"name": "payee",
				"type": "string",
				"default": "",
				"description": "New payee for the transaction."
			},
			{
				"displayName": "Currency",
				"name": "currency",
				"type": "string",
				"default": "",
				"description": "Three-letter lowercase ISO 4217 currency code."
			},
			{
				"displayName": "Category ID",
				"name": "category_id",
				"type": "number",
				"default": 0,
				"description": "Category to assign. Set to null to clear."
			},
			{
				"displayName": "Notes",
				"name": "notes",
				"type": "string",
				"default": "",
				"description": "New notes. Set to empty string to clear."
			},
			{
				"displayName": "Status",
				"name": "status",
				"type": "options",
				"default": "",
				"description": "Transaction status.",
				"options": [
					{
						"name": "Reviewed",
						"value": "reviewed"
					},
					{
						"name": "Unreviewed",
						"value": "unreviewed"
					}
				]
			},
			{
				"displayName": "Recurring Item ID",
				"name": "recurring_id",
				"type": "number",
				"default": 0,
				"description": "ID of a recurring item to associate. Set to null to clear."
			},
			{
				"displayName": "Tag IDs (replace)",
				"name": "tag_ids",
				"type": "string",
				"default": "",
				"description": "Comma-separated tag IDs. Overwrites any existing tags on the transaction."
			},
			{
				"displayName": "Tag IDs (add)",
				"name": "additional_tag_ids",
				"type": "string",
				"default": "",
				"description": "Comma-separated tag IDs to add without replacing existing tags."
			},
			{
				"displayName": "External ID",
				"name": "external_id",
				"type": "string",
				"default": "",
				"description": "User-defined external ID (requires manual_account_id)."
			},
			{
				"displayName": "Manual Account ID",
				"name": "manual_account_id",
				"type": "number",
				"default": 0,
				"description": "ID of the manual account. Set to null to disassociate."
			},
			{
				"displayName": "Update Balance",
				"name": "update_balance",
				"type": "boolean",
				"default": false,
				"description": "Set to false to skip updating the account's balance when changing the transaction."
			}
		]
	},
	{
		"displayName": "Transaction ID",
		"name": "uploadTransactionId",
		"type": "number",
		"default": 0,
		"description": "ID of the transaction to attach the file to.",
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
		"description": "URL of the file to attach.",
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
				"description": "Name for the attachment file."
			}
		]
	},
];
