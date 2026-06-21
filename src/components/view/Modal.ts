import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export class Modal {
  protected contentEl: HTMLElement;
  protected closeBtn: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    this.contentEl = this.container.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = this.container.querySelector('.modal__close') as HTMLButtonElement;

    this.closeBtn.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  setContent(node: HTMLElement): void {
    this.contentEl.replaceChildren(node);
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit(AppEvents.ModalOpen);
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentEl.replaceChildren();
    this.events.emit(AppEvents.ModalClose);
  }
}
