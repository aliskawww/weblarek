import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { ensureElement } from '../../utils/utils';
import { Card, CardBaseState } from './Card';
import { categoryMap } from '../../utils/constants';

const categoryMods = categoryMap as Record<string, string>;

export type CardPreviewState = CardBaseState & {
  category: string;
  description: string;
  image: string;
  buttonText: string;
  buttonDisabled: boolean;
};

export class CardPreview extends Card<CardPreviewState> {
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;
  protected textEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.textEl = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonEl.addEventListener('click', () => {
      if (this.buttonEl.disabled) {
        return;
      }

      this.events.emit(AppEvents.CardAction);
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

  set description(value: string) {
    this.textEl.textContent = value;
  }

  set image(value: string) {
    this.imageEl.src = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceEl.textContent = 'Бесценно';
      return;
    }

    this.priceEl.textContent = `${value} синапсов`;
  }

  set buttonText(value: string) {
    this.buttonEl.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonEl.disabled = value;
  }
}
