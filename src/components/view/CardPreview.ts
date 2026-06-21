import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

const categoryMods = categoryMap as Record<string, string>;

export type PreviewState = {
  inBasket: boolean;
};

export class CardPreview {
  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {}

  render(product: IProduct, state: PreviewState): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const titleEl = el.querySelector('.card__title') as HTMLElement;
    const categoryEl = el.querySelector('.card__category') as HTMLElement;
    const imageEl = el.querySelector('.card__image') as HTMLImageElement;
    const textEl = el.querySelector('.card__text') as HTMLElement;
    const priceEl = el.querySelector('.card__price') as HTMLElement;
    const buttonEl = el.querySelector('.card__button') as HTMLButtonElement;

    titleEl.textContent = product.title;
    categoryEl.textContent = product.category;

    const mod = categoryMods[product.category] ?? categoryMods['другое'] ?? '';
    categoryEl.className = `card__category ${mod}`.trim();

    imageEl.src = product.image.startsWith('http')
      ? product.image
      : `${CDN_URL}${product.image}`;
    imageEl.alt = product.title;

    textEl.textContent = product.description;

    if (product.price === null) {
      priceEl.textContent = '';
      buttonEl.textContent = 'Недоступно';
      buttonEl.disabled = true;
    } else {
      priceEl.textContent = `${product.price} синапсов`;
      buttonEl.disabled = false;

      if (state.inBasket) {
        buttonEl.textContent = 'Удалить из корзины';
        buttonEl.addEventListener('click', () => {
          this.events.emit(AppEvents.ProductRemove, { id: product.id });
        });
      } else {
        buttonEl.textContent = 'Купить';
        buttonEl.addEventListener('click', () => {
          this.events.emit(AppEvents.ProductBuy, { id: product.id });
        });
      }
    }

    return el;
  }
}
