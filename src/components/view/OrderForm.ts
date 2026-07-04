import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { FormBase } from './FormBase';
import { PaymentMethod } from '../../types';
import { ensureElement } from '../../utils/utils';

export type OrderFormState = {
  payment: PaymentMethod | null;
  address: string;
  errorsText: string;
  canSubmit: boolean;
};

export class OrderForm extends FormBase<OrderFormState> {
  protected addressInput: HTMLInputElement;
  protected btnCard: HTMLButtonElement;
  protected btnCash: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.btnCard = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );

    this.btnCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );

    this.btnCard.addEventListener('click', () => {
      this.events.emit(AppEvents.FormChanged, {
        form: (this.container as HTMLFormElement).name,
        field: 'payment',
        value: 'card',
      });
    });

    this.btnCash.addEventListener('click', () => {
      this.events.emit(AppEvents.FormChanged, {
        form: (this.container as HTMLFormElement).name,
        field: 'payment',
        value: 'cash',
      });
    });

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderNext);
    });
  }

  set payment(value: PaymentMethod | null) {
    this.btnCard.classList.toggle('button_alt-active', value === 'card');
    this.btnCash.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set errorsText(value: string) {
    this.setErrors(value);
  }

  set canSubmit(value: boolean) {
    this.setSubmitEnabled(value);
  }

  render(data?: Partial<OrderFormState>): HTMLElement {
    return super.render(data);
  }
}
