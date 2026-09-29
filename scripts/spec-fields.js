function resolveRef(ref, root) {
	const parts = ref.replace(/^#\//, '').split('/');
	let node = root;

	for (const part of parts) {
		node = node[part];
	}

	return node;
}

function resolveSchema(schema, root) {
	if (!schema) return schema;
	if (schema.$ref) return resolveSchema(resolveRef(schema.$ref, root), root);

	if (schema.allOf) {
		const merged = Object.assign({}, ...schema.allOf.map((member) => resolveSchema(member, root)));
		const { allOf, ...ownProperties } = schema;
		return Object.assign(merged, ownProperties);
	}

	return schema;
}

function schemaType(schema) {
	if (schema.oneOf || schema.anyOf) return 'unknown';
	return schema.type || 'unknown';
}

function extractSchemaFields(schema, root, arrayFieldName) {
	const resolvedSchema = resolveSchema(schema, root);
	if (!resolvedSchema || !resolvedSchema.properties) return [];

	const requiredFieldNames = new Set(resolvedSchema.required || []);

	return Object.entries(resolvedSchema.properties).map(([name, propertySchema]) => {
		const resolvedProperty = resolveSchema(propertySchema, root);
		const field = {
			name,
			type: schemaType(resolvedProperty),
			required: requiredFieldNames.has(name),
			description: resolvedProperty.description || '',
			nullable: !!resolvedProperty.nullable,
		};

		if (resolvedProperty.format) field.format = resolvedProperty.format;
		if (resolvedProperty.enum) field.enum = resolvedProperty.enum;
		if (resolvedProperty['x-updatable'] !== undefined) {
			field.updatable = resolvedProperty['x-updatable'];
		}

		if (
			name === arrayFieldName &&
			resolvedProperty.type === 'array' &&
			resolvedProperty.items
		) {
			const itemProps = extractSchemaFields(resolvedProperty.items, root);
			if (itemProps.length > 0) field.itemProps = itemProps;
		}

		return field;
	});
}

function extractBodyProps(operation, root, operationOverride = {}) {
	const content = operation.requestBody && operation.requestBody.content;
	if (!content) return [];

	// JSON is the normal request shape. Multipart is also retained so adapters
	// such as the transaction attachment upload can be checked against the spec.
	const media = content['application/json'] || content['multipart/form-data'];
	const arrayFieldName = operationOverride.bodyAdapter?.arrayField;
	return media ? extractSchemaFields(media.schema, root, arrayFieldName) : [];
}

function specFieldCandidates(endpoint, operationOverride = {}) {
	const nonPathParams = endpoint.params.filter((param) => param.in !== 'path');
	let bodyProps = endpoint.bodyProps.filter((field) => field.updatable !== false);
	const bodyAdapter = operationOverride.bodyAdapter || {};

	if (bodyAdapter.arrayField) {
		const arrayField = bodyProps.find((field) => field.name === bodyAdapter.arrayField);
		if (arrayField && arrayField.itemProps) {
			bodyProps = [
				...arrayField.itemProps,
				...bodyProps.filter((field) => field.name !== bodyAdapter.arrayField),
			];
		}
	}

	if (bodyAdapter.fieldAliases) {
		bodyProps = bodyProps.map((field) => {
			const alias = bodyAdapter.fieldAliases[field.name];
			return alias ? { ...field, name: alias } : field;
		});
	}

	return [...nonPathParams, ...bodyProps];
}

function computeFieldDivergence(endpoint, operationOverride, handlerOnlyFields) {
	const candidates = specFieldCandidates(endpoint, operationOverride);
	const overrideFields = [
		...(operationOverride.fields.required || []),
		...(operationOverride.fields.optional || []),
	];
	const overrideFieldNames = new Set(overrideFields.map((field) => field.name));
	const candidateFieldNames = new Set(candidates.map((field) => field.name));

	const missingFromOverride = candidates
		.filter((field) => !overrideFieldNames.has(field.name))
		.map((field) => field.name);
	const staleInOverride = overrideFields
		.filter(
			(field) =>
				!handlerOnlyFields.has(field.name) && !candidateFieldNames.has(field.name),
		)
		.map((field) => field.name);

	if (missingFromOverride.length === 0 && staleInOverride.length === 0) return null;

	return { missingFromOverride, staleInOverride };
}

module.exports = {
	computeFieldDivergence,
	extractBodyProps,
	resolveSchema,
	schemaType,
	specFieldCandidates,
};
