import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { ensureElement } from '../../utils/utils';

export type BasketRenderData = {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
};

export class BasketView extends Component<BasketRenderData> {
  protected listEl: HTMLElement;
  protected totalEl: HTMLElement;
  protected checkoutBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);
    this.checkoutBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.checkoutBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.BasketCheckout);
    });
  }

  set items(items: HTMLElement[]) {
    this.listEl.replaceChildren(...items);
  }

  set total(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
  }

  set canCheckout(value: boolean) {
    this.checkoutBtn.disabled = !value;
  }
}
