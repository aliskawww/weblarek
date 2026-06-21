import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export type BasketRenderData = {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
};

export class BasketView {
  protected listEl: HTMLElement;
  protected totalEl: HTMLElement;
  protected checkoutBtn: HTMLButtonElement;

  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
    const el = this.template.content.firstElementChild as HTMLElement;
    this.listEl = el.querySelector('.basket__list') as HTMLElement;
    this.totalEl = el.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = el.querySelector('.basket__button') as HTMLButtonElement;
  }

  render(data: BasketRenderData): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const listEl = el.querySelector('.basket__list') as HTMLElement;
    const totalEl = el.querySelector('.basket__price') as HTMLElement;
    const checkoutBtn = el.querySelector('.basket__button') as HTMLButtonElement;

    if (data.items.length === 0) {
      listEl.replaceChildren();
      const empty = document.createElement('p');
      empty.textContent = 'Корзина пуста';
      listEl.append(empty);
    } else {
      listEl.replaceChildren(...data.items);
    }

    totalEl.textContent = `${data.total} синапсов`;
    checkoutBtn.disabled = !data.canCheckout;

    checkoutBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.BasketCheckout);
    });

    return el;
  }
}
