import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';

export type CardBasketState = CardBaseState & {
  id: string;
  index: number;
};

export class CardBasket extends Card<CardBasketState> {
  protected indexEl: HTMLElement;
  protected deleteBtn: HTMLButtonElement;

  protected _id = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexEl = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.BasketItemRemove, { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }

  render(data?: Partial<CardBasketState>): HTMLElement {
    return super.render(data);
  }

  renderProduct(product: IProduct, index: number): HTMLElement {
    return this.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index,
    });
  }
}
