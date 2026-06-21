import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export class SuccessView {
  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {}

  render(total: number): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const desc = el.querySelector('.order-success__description') as HTMLElement;
    const closeBtn = el.querySelector('.order-success__close') as HTMLButtonElement;

    desc.textContent = `Списано ${total} синапсов`;

    closeBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.SuccessClose);
    });

    return el;
  }
}
