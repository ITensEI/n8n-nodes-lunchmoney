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
exports.userFields = [];
//# sourceMappingURL=UserDescription.js.map