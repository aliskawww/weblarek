import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { ensureElement } from '../../utils/utils';

export type HeaderState = {
  counter: number;
};

export class Header extends Component<HeaderState> {
  protected basketBtn: HTMLButtonElement;
  protected counterEl: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketBtn = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterEl = ensureElement<HTMLElement>('.header__basket-counter', this.basketBtn);

    this.basketBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.BasketOpen);
    });
  }

  set counter(value: number) {
    this.counterEl.textContent = String(value);
  }
}
