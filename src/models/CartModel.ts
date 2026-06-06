import { IProduct } from '../types';

export class CartModel {
    protected _items: IProduct[] = [];

    add(product: IProduct): void {
        if (product.price !== null && !this.contains(product.id)) {
            this._items.push(product);
        }
    }

    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clear(): void {
        this._items = [];
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}