import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/app-events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export type FormChangePayload = {
  form: string;
  field: string;
  value: string;
};

export abstract class FormBase<T> extends Component<T> {
  protected submitBtn: HTMLButtonElement;
  protected errorsEl: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    super(template.content.firstElementChild!.cloneNode(true) as HTMLFormElement);

    this.submitBtn = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.errorsEl = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target?.name) return;

      this.events.emit<FormChangePayload>(AppEvents.FormChanged, {
        form: (this.container as HTMLFormElement).name,
        field: target.name,
        value: target.value,
      });
    });
  }

  protected setErrors(text: string): void {
    this.errorsEl.textContent = text;
  }

  protected setSubmitEnabled(enabled: boolean): void {
    this.submitBtn.disabled = !enabled;
  }
}
