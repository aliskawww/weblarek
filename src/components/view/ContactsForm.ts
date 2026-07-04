import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { FormBase } from './FormBase';
import { ensureElement } from '../../utils/utils';

export type ContactsFormState = {
  email: string;
  phone: string;
  errorsText: string;
  canSubmit: boolean;
};

export class ContactsForm extends FormBase<ContactsFormState> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderPay);
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set errorsText(value: string) {
    this.setErrors(value);
  }

  set canSubmit(value: boolean) {
    this.setSubmitEnabled(value);
  }

  render(data?: Partial<ContactsFormState>): HTMLElement {
    return super.render(data);
  }
}
