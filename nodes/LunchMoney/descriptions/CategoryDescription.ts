import type { INodeProperties } from 'n8n-workflow';

export const categoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['category'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new category',
				action: 'Create a category',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a category',
				action: 'Delete a category',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single category by ID',
				action: 'Get a category',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all categories',
				action: 'Get many categories',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a category',
				action: 'Update a category',
			},
		],
		default: 'create',
	},
];

export const categoryFields: INodeProperties[] = [
	{
		"displayName": "Category ID",
		"name": "categoryId",
		"type": "number",
		"required": true,
		"default": 0,
		"description": "The ID of the category",
		"displayOptions": {
			"show": {
				"resource": [
					"category"
				],
				"operation": [
					"get",
					"update",
					"delete"
				]
			}
		}
	},
	{
		"displayName": "Name",
		"name": "name",
		"type": "string",
		"default": "",
		"description": "Name of the category. Must be between 1 and 100 characters and unique.",
		"displayOptions": {
			"show": {
				"resource": [
					"category"
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
					"category"
				],
				"operation": [
					"create"
				]
			}
		},
		"options": [
			{
				"displayName": "Description",
				"name": "description",
				"type": "string",
				"default": "",
				"description": "Description of the category. Must not exceed 200 characters."
			},
			{
				"displayName": "Is Income",
				"name": "is_income",
				"type": "boolean",
				"default": false,
				"description": "If true, transactions in this category are treated as income."
			},
			{
				"displayName": "Exclude From Budget",
				"name": "exclude_from_budget",
				"type": "boolean",
				"default": false,
				"description": "If true, transactions in this category are excluded from the budget."
			},
			{
				"displayName": "Exclude From Totals",
				"name": "exclude_from_totals",
				"type": "boolean",
				"default": false,
				"description": "If true, transactions in this category are excluded from totals."
			},
			{
				"displayName": "Is Group",
				"name": "is_group",
				"type": "boolean",
				"default": false,
				"description": "If true, the category is created as a category group."
			},
			{
				"displayName": "Group ID",
				"name": "group_id",
				"type": "number",
				"default": 0,
				"description": "If set to the ID of an existing category group, this new category will be assigned to that group. Cannot be set if is_group is true."
			},
			{
				"displayName": "Archived",
				"name": "archived",
				"type": "boolean",
				"default": false,
				"description": "If true, the category is archived and not displayed in the Lunch Money app."
			},
			{
				"displayName": "Order",
				"name": "order",
				"type": "number",
				"default": 0,
				"description": "Index specifying the display position on the categories page."
			},
			{
				"displayName": "Collapsed",
				"name": "collapsed",
				"type": "boolean",
				"default": false,
				"description": "If true, the category group appears collapsed in the Lunch Money app. Only applicable to category groups."
			}
		]
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
					"category"
				],
				"operation": [
					"getAll"
				]
			}
		},
		"options": [
			{
				"displayName": "Format",
				"name": "format",
				"type": "options",
				"default": "",
				"description": "\"nested\" returns grouped categories under their parent; \"flattened\" returns all at the top level sorted by order",
				"options": [
					{
						"name": "Nested",
						"value": "nested"
					},
					{
						"name": "Flattened",
						"value": "flattened"
					}
				]
			},
			{
				"displayName": "Is Group Filter",
				"name": "is_group",
				"type": "boolean",
				"default": false,
				"description": "If true, return only category groups. If false, return only non-grouped categories. When set, format is ignored."
			}
		]
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
					"category"
				],
				"operation": [
					"update"
				]
			}
		},
		"options": [
			{
				"displayName": "Name",
				"name": "name",
				"type": "string",
				"default": "",
				"description": "New name for the category. Must be between 1 and 100 characters."
			},
			{
				"displayName": "Description",
				"name": "description",
				"type": "string",
				"default": "",
				"description": "New description. Must not exceed 200 characters."
			},
			{
				"displayName": "Is Income",
				"name": "is_income",
				"type": "boolean",
				"default": false,
				"description": "If set, indicates whether transactions in this category are treated as income."
			},
			{
				"displayName": "Exclude From Budget",
				"name": "exclude_from_budget",
				"type": "boolean",
				"default": false,
				"description": "If set, indicates whether transactions are excluded from the budget."
			},
			{
				"displayName": "Exclude From Totals",
				"name": "exclude_from_totals",
				"type": "boolean",
				"default": false,
				"description": "If set, indicates whether transactions are excluded from totals."
			},
			{
				"displayName": "Group ID",
				"name": "group_id",
				"type": "number",
				"default": 0,
				"description": "If set to an existing category group ID, assigns this category to that group."
			},
			{
				"displayName": "Is Group",
				"name": "is_group",
				"type": "boolean",
				"default": false,
				"description": "May not be changed from the current status of the category."
			},
			{
				"displayName": "Archived",
				"name": "archived",
				"type": "boolean",
				"default": false,
				"description": "If set, indicates whether the category is archived."
			},
			{
				"displayName": "Order",
				"name": "order",
				"type": "number",
				"default": 0,
				"description": "Index specifying the display position on the categories page."
			},
			{
				"displayName": "Collapsed",
				"name": "collapsed",
				"type": "boolean",
				"default": false,
				"description": "If true, the category group appears collapsed. Only applicable to category groups."
			}
		]
	},
];
