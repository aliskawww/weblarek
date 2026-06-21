export class Gallery {
  constructor(protected container: HTMLElement) {}

  render(items: HTMLElement[]): HTMLElement {
    this.container.replaceChildren(...items);
    return this.container;
  }
}
