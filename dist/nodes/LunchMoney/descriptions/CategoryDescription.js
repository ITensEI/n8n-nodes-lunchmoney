"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryFields = exports.categoryOperations = void 0;
exports.categoryOperations = [
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
exports.categoryFields = [
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
        "description": "Name of the category",
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
                "description": "Description of the category"
            },
            {
                "displayName": "Is Income",
                "name": "is_income",
                "type": "boolean",
                "default": false,
                "description": "Whether transactions in this category are treated as income"
            },
            {
                "displayName": "Exclude From Budget",
                "name": "exclude_from_budget",
                "type": "boolean",
                "default": false,
                "description": "Whether to exclude from budget calculations"
            },
            {
                "displayName": "Exclude From Totals",
                "name": "exclude_from_totals",
                "type": "boolean",
                "default": false,
                "description": "Whether to exclude from totals"
            },
            {
                "displayName": "Group ID",
                "name": "group_id",
                "type": "number",
                "default": 0,
                "description": "ID of the category group this belongs to"
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
                "description": "Response format. \"nested\" groups child categories under their parent; \"flattened\" includes all at the top level",
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
                "displayName": "Is Group",
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
                "description": "Name of the category"
            },
            {
                "displayName": "Description",
                "name": "description",
                "type": "string",
                "default": "",
                "description": "Description of the category"
            },
            {
                "displayName": "Is Income",
                "name": "is_income",
                "type": "boolean",
                "default": false,
                "description": "Whether transactions in this category are treated as income"
            },
            {
                "displayName": "Exclude From Budget",
                "name": "exclude_from_budget",
                "type": "boolean",
                "default": false,
                "description": "Whether to exclude from budget calculations"
            },
            {
                "displayName": "Exclude From Totals",
                "name": "exclude_from_totals",
                "type": "boolean",
                "default": false,
                "description": "Whether to exclude from totals"
            },
            {
                "displayName": "Group ID",
                "name": "group_id",
                "type": "number",
                "default": 0,
                "description": "ID of the category group this belongs to"
            },
            {
                "displayName": "Archived",
                "name": "archived",
                "type": "boolean",
                "default": false,
                "description": "Whether the category is archived"
            }
        ]
    },
];
//# sourceMappingURL=CategoryDescription.js.map