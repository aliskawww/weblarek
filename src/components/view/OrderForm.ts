import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { FormBase } from './FormBase';

export class OrderForm extends FormBase {
  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
  }

  render(state: { payment: 'card' | 'cash' | null; address: string; errorsText: string; canSubmit: boolean }): HTMLElement {
    const el = this.template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

    const addressInput = el.querySelector('input[name="address"]') as HTMLInputElement;
    const btnCard = el.querySelector('button[name="card"]') as HTMLButtonElement;
    const btnCash = el.querySelector('button[name="cash"]') as HTMLButtonElement;

    addressInput.value = state.address ?? '';

    const setActive = (btn: HTMLButtonElement, active: boolean) => {
      btn.classList.toggle('button_alt-active', active);
    };
    setActive(btnCard, state.payment === 'card');
    setActive(btnCash, state.payment === 'cash');

    btnCard.addEventListener('click', () => {
      this.events.emit(AppEvents.FormChanged, { form: el.name, field: 'payment', value: 'card' });
    });
    btnCash.addEventListener('click', () => {
      this.events.emit(AppEvents.FormChanged, { form: el.name, field: 'payment', value: 'cash' });
    });

    this.bindCommonListeners(el);

    el.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvents.OrderNext);
    });

    this.setErrors(el, state.errorsText);
    this.setSubmitEnabled(el, state.canSubmit);

    return el;
  }
}
