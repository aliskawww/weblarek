export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiOrder {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export interface IApiOrderResult {
  id: string;
  total: number;
}

export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  category: string;
  description: string;
  image: string;
}

export type PaymentMethod = 'card' | 'cash';

export interface IBuyerData {
  payment: PaymentMethod | null;
  address: string;
  email: string;
  phone: string;
}

export type ValidationErrors = Partial<Record<keyof IBuyerData, string>>;

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}