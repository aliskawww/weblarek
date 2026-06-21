import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export class ProductsModel {
  protected _items: Map<string, IProduct> = new Map();
  protected _preview: string | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items.clear();
    items.forEach((item) => this._items.set(item.id, item));
    this.events.emit(AppEvents.CatalogChanged);
  }

  getItems(): IProduct[] {
    return Array.from(this._items.values());
  }

  getProductById(id: string): IProduct | undefined {
    return this._items.get(id);
  }

  setPreview(id: string): void {
    this._preview = id;
    this.events.emit(AppEvents.PreviewChanged);
  }

  getPreview(): IProduct | null {
    return this._preview ? this._items.get(this._preview) || null : null;
  }
}
