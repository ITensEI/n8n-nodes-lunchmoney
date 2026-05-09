"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lunchMoneyApiRequest = lunchMoneyApiRequest;
exports.lunchMoneyApiRequestAllItems = lunchMoneyApiRequestAllItems;
exports.validateDateFormat = validateDateFormat;
exports.validateAmount = validateAmount;
exports.validateCurrency = validateCurrency;
const n8n_workflow_1 = require("n8n-workflow");
const LIVE_BASE_URL = 'https://api.lunchmoney.dev/v2';
const MOCK_BASE_URL = 'https://lm-v2-api-next-a7fabcab8e9a.herokuapp.com/v2';
async function lunchMoneyApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('lunchMoneyApi');
    const useMock = credentials.useMockServer;
    const baseURL = useMock ? MOCK_BASE_URL : LIVE_BASE_URL;
    const options = {
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
        return await this.helpers.requestWithAuthentication.call(this, 'lunchMoneyApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: parseErrorMessage(error),
        });
    }
}
async function lunchMoneyApiRequestAllItems(method, endpoint, body = {}, qs = {}, dataKey) {
    let responseData;
    const returnData = [];
    qs.limit = qs.limit || 500;
    qs.offset = 0;
    do {
        responseData = await lunchMoneyApiRequest.call(this, method, endpoint, body, qs);
        const items = dataKey ? responseData[dataKey] : responseData;
        if (Array.isArray(items)) {
            returnData.push(...items);
        }
        else {
            returnData.push(items);
            break;
        }
        if (items.length < qs.limit) {
            break;
        }
        qs.offset = qs.offset + qs.limit;
    } while (true);
    return returnData;
}
function parseErrorMessage(error) {
    var _a, _b, _c, _d, _e;
    if ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.body) {
        const body = error.response.body;
        if (typeof body === 'string') {
            try {
                const parsed = JSON.parse(body);
                return parsed.message || ((_c = (_b = parsed.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.errMsg) || body;
            }
            catch {
                return body;
            }
        }
        if (body.message)
            return body.message;
        if ((_e = (_d = body.errors) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.errMsg)
            return body.errors[0].errMsg;
    }
    return error.message || 'Unknown API error';
}
function validateDateFormat(value, fieldName) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`${fieldName} must be in YYYY-MM-DD format. Got: "${value}"`);
    }
}
function validateAmount(value, fieldName) {
    if (!/^-?\d+(\.\d{1,3})?$/.test(value)) {
        throw new Error(`${fieldName} must be a valid decimal amount (e.g. "25.00"). Got: "${value}"`);
    }
}
function validateCurrency(value, fieldName) {
    if (!/^[a-z]{3}$/.test(value.toLowerCase())) {
        throw new Error(`${fieldName} must be a 3-letter ISO 4217 currency code (e.g. "usd"). Got: "${value}"`);
    }
}
//# sourceMappingURL=GenericFunctions.js.map