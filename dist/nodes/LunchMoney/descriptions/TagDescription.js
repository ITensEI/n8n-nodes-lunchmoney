"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagFields = exports.tagOperations = void 0;
exports.tagOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['tag'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new tag',
                action: 'Create a tag',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a tag',
                action: 'Delete a tag',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a single tag by ID',
                action: 'Get a tag',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all tags',
                action: 'Get many tags',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a tag',
                action: 'Update a tag',
            },
        ],
        default: 'create',
    },
];
exports.tagFields = [
    {
        "displayName": "Tag ID",
        "name": "tagId",
        "type": "number",
        "required": true,
        "default": 0,
        "description": "The ID of the tag",
        "displayOptions": {
            "show": {
                "resource": [
                    "tag"
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
        "description": "Name of the tag",
        "displayOptions": {
            "show": {
                "resource": [
                    "tag"
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
                    "tag"
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
                "description": "Description of the tag"
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
                    "tag"
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
                "description": "Name of the tag"
            },
            {
                "displayName": "Description",
                "name": "description",
                "type": "string",
                "default": "",
                "description": "Description of the tag"
            }
        ]
    },
];
//# sourceMappingURL=TagDescription.js.map