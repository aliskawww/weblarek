import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export type CardBaseState = {
  title: string;
  price: number | null;
};

export class Card<T extends CardBaseState> extends Component<T> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent = value === null ? '—' : `${value} синапсов`;
  }
}
