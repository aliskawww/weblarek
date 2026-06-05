import { Api } from './Api';
import { IProduct, IApiOrder, IApiOrderResult } from '../../types';

export class LarekApi extends Api {
  getProducts(): Promise<{ items: IProduct[] }> {
    return this.get('/product') as Promise<{ items: IProduct[] }>;
  }

  postOrder(order: IApiOrder): Promise<IApiOrderResult> {
    return this.post('/order', order) as Promise<IApiOrderResult>;
  }
}