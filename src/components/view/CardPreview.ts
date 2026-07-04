import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';
import { categoryMap } from '../../utils/constants';

const categoryMods = categoryMap as Record<string, string>;

export type CardPreviewState = CardBaseState & {
  id: string;
  category: string;
  description: string;
  image: string;
  inBasket: boolean;
  available: boolean;
};

export class CardPreview extends Card<CardPreviewState> {
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;
  protected textEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  protected _id = '';
  protected _inBasket = false;
  protected _available = true;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.textEl = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonEl.addEventListener('click', () => {
      if (!this._available) {
        return;
      }

      this.events.emit(AppEvents.CardAction, { id: this._id });
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

  set description(value: string) {
    this.textEl.textContent = value;
  }

  set image(value: string) {
    this.imageEl.src = value;
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    if (this._available) {
      this.buttonEl.textContent = value ? 'Удалить из корзины' : 'Купить';
    }
  }

  set available(value: boolean) {
    this._available = value;
    this.buttonEl.disabled = !value;

    if (!value) {
      this.buttonEl.textContent = 'Недоступно';
      this.priceEl.textContent = 'Бесценно';
    } else {
      this.buttonEl.textContent = this._inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }
}
