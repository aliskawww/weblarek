import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';

const categoryMods = categoryMap as Record<string, string>;

export type CardCatalogState = CardBaseState & {
  id: string;
  category: string;
  image: string;
};

export class CardCatalog extends Card<CardCatalogState> {
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;
  protected _id = '';

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      this.events.emit(AppEvents.ProductOpen, { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    super.title = value;
    this.imageEl.alt = value;
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    const mod = categoryMods[value] ?? categoryMods['другое'] ?? '';
    this.categoryEl.className = `card__category ${mod}`.trim();
  }

  set image(value: string) {
    this.imageEl.src = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent = value === null ? 'Недоступно' : `${value} синапсов`;
  }
}
