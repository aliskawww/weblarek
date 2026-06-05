import { IProduct } from '../../../types';

export class CartModel {
    protected _items: Set<string> = new Set();

    add(product: IProduct): void {
        if (product.price !== null) {
            this._items.add(product.id);
        }
    }

    remove(id: string): void {
        this._items.delete(id);
    }

    clear(): void {
        this._items.clear();
    }

    getItems(): string[] {
        return Array.from(this._items);
    }

    getTotal(products: Map<string, IProduct>): number {
        let total = 0;
        for (const id of this._items) {
            const product = products.get(id);
            if (product?.price) total += product.price;
        }
        return total;
    }

    getCount(): number {
        return this._items.size;
    }

    contains(id: string): boolean {
        return this._items.has(id);
    }
}