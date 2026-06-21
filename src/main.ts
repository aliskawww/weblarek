import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { AppEvents } from './utils/app-events';

import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModels';

import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';

const events = new EventEmitter();

const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const apiInstance = new Api(API_URL);
const api = new LarekApi(apiInstance);

const galleryEl = document.querySelector('main.gallery');
if (!galleryEl) throw new Error('Не найден контейнер каталога .gallery');

const basketBtn = document.querySelector('.header__basket') as HTMLButtonElement | null;
if (!basketBtn) throw new Error('Не найдена кнопка корзины .header__basket');

const basketCounterEl = basketBtn.querySelector('.header__basket-counter') as HTMLElement | null;
if (!basketCounterEl) throw new Error('Не найден счётчик корзины .header__basket-counter');

const modalEl = document.getElementById('modal-container');
if (!modalEl) throw new Error('Не найден контейнер модалки #modal-container');

const modal = new Modal(modalEl, events);
const gallery = new Gallery(galleryEl as HTMLElement);

const getTemplate = (id: string): HTMLTemplateElement => {
  const t = document.getElementById(id);
  if (!t) throw new Error(`Не найден template #${id} в index.html`);
  if (!(t instanceof HTMLTemplateElement)) throw new Error(`#${id} не является <template>`);
  return t;
};

const cardCatalogTemplate = getTemplate('card-catalog');
const cardPreviewTemplate = getTemplate('card-preview');
const cardBasketTemplate = getTemplate('card-basket');
const basketTemplate = getTemplate('basket');
const orderTemplate = getTemplate('order');
const contactsTemplate = getTemplate('contacts');
const successTemplate = getTemplate('success');

const cardCatalogView = new CardCatalog(cardCatalogTemplate, events);
const cardPreviewView = new CardPreview(cardPreviewTemplate, events);
const cardBasketView = new CardBasket(cardBasketTemplate, events);
const basketView = new BasketView(basketTemplate, events);
const orderFormView = new OrderForm(orderTemplate, events);
const contactsFormView = new ContactsForm(contactsTemplate, events);
const successView = new SuccessView(successTemplate, events);

const buildErrorsText = (errors: Record<string, string | undefined>) =>
  Object.values(errors).filter(Boolean).join('. ');

events.on(AppEvents.CatalogChanged, () => {
  const cards = productsModel.getItems().map((p) => cardCatalogView.render(p));
  gallery.render(cards);
});

events.on<{ id: string }>(AppEvents.ProductOpen, ({ id }) => {
  productsModel.setPreview(id);
});

events.on(AppEvents.PreviewChanged, () => {
  const product = productsModel.getPreview();
  if (!product) return;

  const node = cardPreviewView.render(product, { inBasket: cartModel.contains(product.id) });
  modal.setContent(node);
  modal.open();
});

basketBtn.addEventListener('click', () => {
  events.emit(AppEvents.BasketOpen);
});

events.on(AppEvents.BasketChanged, () => {
  basketCounterEl.textContent = String(cartModel.getCount());
});

let openBasketAfterModalClose = false;

events.on<{ id: string }>(AppEvents.ProductBuy, ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  cartModel.add(product);

  openBasketAfterModalClose = true;
  modal.close();
});

events.on<{ id: string }>(AppEvents.ProductRemove, ({ id }) => {
  cartModel.remove(id);

  openBasketAfterModalClose = true;
  modal.close();
});

events.on(AppEvents.BasketOpen, () => {
  const items = cartModel.getItems().map((p, i) => cardBasketView.render(p, i + 1));
  const node = basketView.render({
    items,
    total: cartModel.getTotal(),
    canCheckout: cartModel.getCount() > 0,
  });
  modal.setContent(node);
  modal.open();
});

events.on<{ id: string }>(AppEvents.BasketItemRemove, ({ id }) => {
  cartModel.remove(id);
});

events.on(AppEvents.BasketChanged, () => {
  const isOpen = modalEl.classList.contains('modal_active');
  if (!isOpen) return;

  const hasBasket = modalEl.querySelector('.basket');
  if (!hasBasket) return;

  const items = cartModel.getItems().map((p, i) => cardBasketView.render(p, i + 1));
  const node = basketView.render({
    items,
    total: cartModel.getTotal(),
    canCheckout: cartModel.getCount() > 0,
  });
  modal.setContent(node);
});

events.on(AppEvents.BasketCheckout, () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();
  const step1Errors: Record<string, string | undefined> = {
    payment: errors.payment,
    address: errors.address,
  };

  const node = orderFormView.render({
    payment: data.payment,
    address: data.address,
    errorsText: buildErrorsText(step1Errors),
    canSubmit: !step1Errors.payment && !step1Errors.address && !!data.payment && !!data.address.trim(),
  });

  modal.setContent(node);
  modal.open();
});

events.on<{ form: string; field: string; value: string }>(AppEvents.FormChanged, ({ field, value }) => {
  if (field === 'payment') {
    buyerModel.setField('payment', value === 'card' || value === 'cash' ? value : null);
  } else if (field === 'address') {
    buyerModel.setField('address', value);
  } else if (field === 'email') {
    buyerModel.setField('email', value);
  } else if (field === 'phone') {
    buyerModel.setField('phone', value);
  }
});

events.on(AppEvents.OrderNext, () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  if (errors.payment || errors.address) {
    const step1Errors: Record<string, string | undefined> = {
      payment: errors.payment,
      address: errors.address,
    };

    const node = orderFormView.render({
      payment: data.payment,
      address: data.address,
      errorsText: buildErrorsText(step1Errors),
      canSubmit: !step1Errors.payment && !step1Errors.address && !!data.payment && !!data.address.trim(),
    });

    modal.setContent(node);
    modal.open();
    return;
  }

  const step2Errors: Record<string, string | undefined> = {
    email: errors.email,
    phone: errors.phone,
  };

  const node = contactsFormView.render({
    email: data.email,
    phone: data.phone,
    errorsText: buildErrorsText(step2Errors),
    canSubmit: !step2Errors.email && !step2Errors.phone && !!data.email.trim() && !!data.phone.trim(),
  });

  modal.setContent(node);
  modal.open();
});

events.on(AppEvents.OrderPay, () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  if (errors.email || errors.phone) {
    const step2Errors: Record<string, string | undefined> = {
      email: errors.email,
      phone: errors.phone,
    };

    const node = contactsFormView.render({
      email: data.email,
      phone: data.phone,
      errorsText: buildErrorsText(step2Errors),
      canSubmit: !step2Errors.email && !step2Errors.phone && !!data.email.trim() && !!data.phone.trim(),
    });

    modal.setContent(node);
    modal.open();
    return;
  }

  if (!data.payment) return;

  api.postOrder({
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    items: cartModel.getItems().map((p) => p.id),
    total: cartModel.getTotal(),
  })
    .then((res) => {
      const node = successView.render(res.total);
      modal.setContent(node);
      modal.open();

      cartModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error('Ошибка оплаты:', err);
    });
});

events.on(AppEvents.SuccessClose, () => {
  modal.close();
});

events.on(AppEvents.ModalClose, () => {
  if (!openBasketAfterModalClose) return;

  openBasketAfterModalClose = false;
  events.emit(AppEvents.BasketOpen);
});

api.getProducts()
  .then((data) => productsModel.setItems(data.items))
  .catch((err) => {
    console.error('Ошибка API:', err);
  });
