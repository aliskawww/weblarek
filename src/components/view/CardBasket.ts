import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { IProduct } from '../../types';

export class CardBasket {
  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {}

  render(product: IProduct, index: number): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const indexEl = el.querySelector('.basket__item-index') as HTMLElement;
    const titleEl = el.querySelector('.card__title') as HTMLElement;
    const priceEl = el.querySelector('.card__price') as HTMLElement;
    const deleteBtn = el.querySelector('.basket__item-delete') as HTMLButtonElement;

    indexEl.textContent = String(index);
    titleEl.textContent = product.title;
    priceEl.textContent = product.price === null ? '—' : `${product.price} синапсов`;

    deleteBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.BasketItemRemove, { id: product.id });
    });

    return el;
  }
}
