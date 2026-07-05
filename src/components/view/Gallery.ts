import { Component } from '../base/Component';

export type GalleryState = {
  items: HTMLElement[];
};

export class Gallery extends Component<GalleryState> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
