import { Api } from '../components/base/Api';
import { IApiOrder, IApiOrderResult, IProductsResponse } from '../types';

export class LarekApi {
    private _api: Api;

    constructor(api: Api) {  
        this._api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this._api.get<IProductsResponse>('/product');
    }

    postOrder(order: IApiOrder): Promise<IApiOrderResult> {
        return this._api.post<IApiOrderResult>('/order', order);
    }
}