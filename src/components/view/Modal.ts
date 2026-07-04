import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export type ModalState = {
  content?: HTMLElement;
};

export class Modal extends Component<ModalState> {
  protected contentEl: HTMLElement;
  protected closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentEl = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.ModalClose);
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.events.emit(AppEvents.ModalClose);
      }
    });
  }

  set content(node: HTMLElement) {
    this.contentEl.replaceChildren(node);
  }

  render(data?: Partial<ModalState>): HTMLElement {
    return super.render(data);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentEl.replaceChildren();
  }
}
