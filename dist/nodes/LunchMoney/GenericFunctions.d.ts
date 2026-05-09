import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function lunchMoneyApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function lunchMoneyApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, dataKey?: string): Promise<any[]>;
export declare function validateDateFormat(value: string, fieldName: string): void;
export declare function validateAmount(value: string, fieldName: string): void;
export declare function validateCurrency(value: string, fieldName: string): void;
