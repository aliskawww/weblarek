import { Component } from '../base/Component';

export type GalleryState = {
  items: HTMLElement[];
};

export class Gallery extends Component<GalleryState> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data: GalleryState): HTMLElement {
    super.render(data);
    this.container.replaceChildren(...data.items);
    return this.container;
  }
}
