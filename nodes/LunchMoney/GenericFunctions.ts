import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const LIVE_BASE_URL = 'https://api.lunchmoney.dev/v2';
const MOCK_BASE_URL = 'https://lm-v2-api-next-a7fabcab8e9a.herokuapp.com/v2';

export async function lunchMoneyApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('lunchMoneyApi');
	const useMock = credentials.useMockServer as boolean;
	const baseURL = useMock ? MOCK_BASE_URL : LIVE_BASE_URL;

	const options: IRequestOptions = {
		method,
		uri: `${baseURL}${endpoint}`,
		qs,
		body,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}
	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		return await this.helpers.requestWithAuthentication.call(
			this,
			'lunchMoneyApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: parseErrorMessage(error),
		});
	}
}

export async function lunchMoneyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	dataKey?: string,
): Promise<any[]> {
	let responseData: any;
	const returnData: any[] = [];

	qs.limit = qs.limit || 500;
	qs.offset = 0;

	do {
		responseData = await lunchMoneyApiRequest.call(this, method, endpoint, body, qs);
		const items = dataKey ? responseData[dataKey] : responseData;

		if (Array.isArray(items)) {
			returnData.push(...items);
		} else {
			returnData.push(items);
			break;
		}

		if (items.length < (qs.limit as number)) {
			break;
		}

		qs.offset = (qs.offset as number) + (qs.limit as number);
	} while (true);

	return returnData;
}

function parseErrorMessage(error: any): string {
	if (error?.response?.body) {
		const body = error.response.body;
		if (typeof body === 'string') {
			try {
				const parsed = JSON.parse(body);
				return parsed.message || parsed.errors?.[0]?.errMsg || body;
			} catch {
				return body;
			}
		}
		if (body.message) return body.message;
		if (body.errors?.[0]?.errMsg) return body.errors[0].errMsg;
	}
	return error.message || 'Unknown API error';
}

export function validateDateFormat(value: string, fieldName: string): void {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		throw new Error(`${fieldName} must be in YYYY-MM-DD format. Got: "${value}"`);
	}
}

export function validateAmount(value: string, fieldName: string): void {
	if (!/^-?\d+(\.\d{1,3})?$/.test(value)) {
		throw new Error(
			`${fieldName} must be a valid decimal amount (e.g. "25.00"). Got: "${value}"`,
		);
	}
}

export function validateCurrency(value: string, fieldName: string): void {
	if (!/^[a-z]{3}$/.test(value.toLowerCase())) {
		throw new Error(
			`${fieldName} must be a 3-letter ISO 4217 currency code (e.g. "usd"). Got: "${value}"`,
		);
	}
}
