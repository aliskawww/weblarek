import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

const categoryMods = categoryMap as Record<string, string>;

export class CardCatalog {
  protected titleEl: HTMLElement;
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;
  protected priceEl: HTMLElement;

  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
    const el = this.template.content.firstElementChild as HTMLElement;
    this.titleEl = el.querySelector('.card__title') as HTMLElement;
    this.categoryEl = el.querySelector('.card__category') as HTMLElement;
    this.imageEl = el.querySelector('.card__image') as HTMLImageElement;
    this.priceEl = el.querySelector('.card__price') as HTMLElement;
  }

  render(product: IProduct): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const titleEl = el.querySelector('.card__title') as HTMLElement;
    const categoryEl = el.querySelector('.card__category') as HTMLElement;
    const imageEl = el.querySelector('.card__image') as HTMLImageElement;
    const priceEl = el.querySelector('.card__price') as HTMLElement;

    titleEl.textContent = product.title;
    categoryEl.textContent = product.category;

    // модификатор категории
    const mod = categoryMods[product.category] ?? categoryMods['другое'] ?? '';
    categoryEl.className = `card__category ${mod}`.trim();

    // В API image обычно относительный путь, добавляем CDN/базу
    // Если image уже абсолютный (http...), оставляем как есть
    imageEl.src = product.image.startsWith('http')
      ? product.image
      : `${CDN_URL}${product.image}`;
    imageEl.alt = product.title;

    if (product.price === null) {
      priceEl.textContent = 'Недоступно';
      (el as HTMLButtonElement).disabled = true;
    } else {
      priceEl.textContent = `${product.price} синапсов`;
      (el as HTMLButtonElement).disabled = false;
    }

    el.addEventListener('click', () => {
      this.events.emit(AppEvents.ProductOpen, { id: product.id });
    });

    return el;
  }
}
