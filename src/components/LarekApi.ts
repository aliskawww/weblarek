import { IApi } from '../types';
import { IApiOrder, IApiOrderResult, IProductsResponse } from '../types';

export class LarekApi {
    private _api: IApi;

    constructor(api: IApi) {  
        this._api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this._api.get<IProductsResponse>('/product');
    }

    postOrder(order: IApiOrder): Promise<IApiOrderResult> {
        return this._api.post<IApiOrderResult>('/order', order);
    }
}