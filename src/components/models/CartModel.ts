import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export class CartModel {
  protected _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  add(product: IProduct): void {
    if (product.price !== null && !this.contains(product.id)) {
      this._items.push(product);
      this.events.emit(AppEvents.BasketChanged);
    }
  }

  remove(id: string): void {
    const before = this._items.length;
    this._items = this._items.filter((item) => item.id !== id);
    if (this._items.length !== before) {
      this.events.emit(AppEvents.BasketChanged);
    }
  }

  clear(): void {
    this._items = [];
    this.events.emit(AppEvents.BasketChanged);
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
    return this._items.some((item) => item.id === id);
  }
}
