import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';

export type FormChangePayload = {
  form: string;
  field: string;
  value: string;
};

export class FormBase {
  protected formEl: HTMLFormElement;
  protected submitBtn: HTMLButtonElement;
  protected errorsEl: HTMLElement;

  constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
    const el = this.template.content.firstElementChild as HTMLFormElement;
    this.formEl = el;
    this.submitBtn = el.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = el.querySelector('.form__errors') as HTMLElement;
  }

  protected bindCommonListeners(el: HTMLFormElement): void {
    el.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target?.name) return;
      this.events.emit<FormChangePayload>(AppEvents.FormChanged, {
        form: el.name,
        field: target.name,
        value: target.value,
      });
    });
  }

  setErrors(el: HTMLElement, text: string): void {
    const errorsEl = el.querySelector('.form__errors') as HTMLElement;
    errorsEl.textContent = text;
  }

  setSubmitEnabled(el: HTMLElement, enabled: boolean): void {
    const btn = el.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = !enabled;
  }
}
