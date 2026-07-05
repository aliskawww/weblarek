import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';

const categoryMods = categoryMap as Record<string, string>;

export type CardCatalogState = CardBaseState & {
  category: string;
  image: string;
};

export class CardCatalog extends Card<CardCatalogState> {
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;

  constructor(container: HTMLElement, protected onOpen: () => void) {
    super(container);

    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      this.onOpen();
    });
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
