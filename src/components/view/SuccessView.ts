import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export type SuccessState = {
  total: number;
};

export class SuccessView extends Component<SuccessState> {
  protected descEl: HTMLElement;
  protected closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descEl = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.closeBtn = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.closeBtn.addEventListener('click', () => {
      this.events.emit(AppEvents.SuccessClose);
    });
  }

  set total(value: number) {
    this.descEl.textContent = `Списано ${value} синапсов`;
  }
}
