import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { FormBase } from './FormBase';

export class ContactsForm extends FormBase {
  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
  }

  render(state: { email: string; phone: string; errorsText: string; canSubmit: boolean }): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

    const emailInput = el.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = el.querySelector('input[name="phone"]') as HTMLInputElement;

    emailInput.value = state.email ?? '';
    phoneInput.value = state.phone ?? '';

    this.bindCommonListeners(el);

    el.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderPay);
    });

    this.setErrors(el, state.errorsText);
    this.setSubmitEnabled(el, state.canSubmit);

    return el;
  }
}
