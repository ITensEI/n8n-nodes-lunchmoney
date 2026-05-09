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
        "type": "string",
        "required": true,
        "default": "",
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
        "description": "Name of the tag. Must be between 1 and 100 characters and must not match any existing tag name.",
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
                "description": "Description of the tag. Must not exceed 200 characters."
            },
            {
                "displayName": "Text Color",
                "name": "text_color",
                "type": "string",
                "default": "",
                "description": "Text color for the tag (e.g. \"#ffffff\")."
            },
            {
                "displayName": "Background Color",
                "name": "background_color",
                "type": "string",
                "default": "",
                "description": "Background color for the tag (e.g. \"#1a73e8\")."
            },
            {
                "displayName": "Archived",
                "name": "archived",
                "type": "boolean",
                "default": false,
                "description": "If true, the tag is archived and not displayed in the Lunch Money app."
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
                "description": "New name for the tag. Must be between 1 and 100 characters."
            },
            {
                "displayName": "Description",
                "name": "description",
                "type": "string",
                "default": "",
                "description": "New description. Must not exceed 200 characters."
            },
            {
                "displayName": "Text Color",
                "name": "text_color",
                "type": "string",
                "default": "",
                "description": "Text color for the tag (e.g. \"#ffffff\")."
            },
            {
                "displayName": "Background Color",
                "name": "background_color",
                "type": "string",
                "default": "",
                "description": "Background color for the tag (e.g. \"#1a73e8\")."
            },
            {
                "displayName": "Archived",
                "name": "archived",
                "type": "boolean",
                "default": false,
                "description": "If set, indicates whether the tag is archived."
            }
        ]
    },
];
//# sourceMappingURL=TagDescription.js.map