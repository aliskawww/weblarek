import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';

export type CardBasketState = CardBaseState & {
  index: number;
};

export class CardBasket extends Card<CardBasketState> {
  protected indexEl: HTMLElement;
  protected deleteBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected onDelete: () => void) {
    super(container);

    this.indexEl = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );

    this.deleteBtn = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    this.deleteBtn.addEventListener('click', () => {
      this.onDelete();
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
}
