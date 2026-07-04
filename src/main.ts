import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppEvents } from './utils/app-events';
import { ensureElement, cloneTemplate } from './utils/utils';

import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModels';

import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
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

const page = ensureElement<HTMLElement>('.page');
const galleryEl = ensureElement<HTMLElement>('main.gallery');
const modalEl = ensureElement<HTMLElement>('#modal-container');

const header = new Header(page, events);
const modal = new Modal(modalEl, events);
const gallery = new Gallery(galleryEl);

const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const orderFormView = new OrderForm(ensureElement<HTMLTemplateElement>('#order'), events);
const contactsFormView = new ContactsForm(ensureElement<HTMLTemplateElement>('#contacts'), events);
const successView = new SuccessView(cloneTemplate<HTMLElement>('#success'), events);

const buildErrorsText = (errors: Record<string, string | undefined>) =>
  Object.values(errors).filter(Boolean).join('. ');

type ModalScreen = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;
let currentModalScreen: ModalScreen = null;

const renderBasketItems = () =>
  cartModel.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), events);
    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

const renderBasket = () =>
  basketView.render({
    items: renderBasketItems(),
    total: cartModel.getTotal(),
    canCheckout: cartModel.getCount() > 0,
  });

const renderOrderForm = () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  return orderFormView.render({
    payment: data.payment,
    address: data.address,
    errorsText: buildErrorsText({
      payment: errors.payment,
      address: errors.address,
    }),
    canSubmit: !errors.payment && !errors.address,
  });
};

const renderContactsForm = () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  return contactsFormView.render({
    email: data.email,
    phone: data.phone,
    errorsText: buildErrorsText({
      email: errors.email,
      phone: errors.phone,
    }),
    canSubmit: !errors.email && !errors.phone,
  });
};

events.on(AppEvents.CatalogChanged, () => {
  const cards = productsModel.getItems().map((product) => {
    const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), events);

    return card.render({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image.startsWith('http')
        ? product.image
        : `${CDN_URL}${product.image}`,
    });
  });

  gallery.render({ items: cards });
});

events.on(AppEvents.BasketChanged, () => {
  header.render({ counter: cartModel.getCount() });

  if (currentModalScreen === 'basket') {
    modal.render({
      content: renderBasket(),
    });
  }
});

events.on(AppEvents.PreviewChanged, () => {
  const product = productsModel.getPreview();
  if (!product) return;

  const preview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), events);

  modal.render({
    content: preview.render({
      id: product.id,
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image.startsWith('http')
        ? product.image
        : `${CDN_URL}${product.image}`,
      inBasket: cartModel.contains(product.id),
      available: product.price !== null,
    }),
  });

  currentModalScreen = 'preview';
  modal.open();
});

events.on(AppEvents.BuyerChanged, () => {
  if (currentModalScreen === 'order') {
    orderFormView.render({
      payment: buyerModel.getData().payment,
      address: buyerModel.getData().address,
      errorsText: buildErrorsText({
        payment: buyerModel.validate().payment,
        address: buyerModel.validate().address,
      }),
      canSubmit: !buyerModel.validate().payment && !buyerModel.validate().address,
    });
  }

  if (currentModalScreen === 'contacts') {
    contactsFormView.render({
      email: buyerModel.getData().email,
      phone: buyerModel.getData().phone,
      errorsText: buildErrorsText({
        email: buyerModel.validate().email,
        phone: buyerModel.validate().phone,
      }),
      canSubmit: !buyerModel.validate().email && !buyerModel.validate().phone,
    });
  }
});

events.on<{ id: string }>(AppEvents.ProductOpen, ({ id }) => {
  productsModel.setPreview(id);
});

events.on<{ id: string }>(AppEvents.CardAction, ({ id }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  if (cartModel.contains(id)) {
    cartModel.remove(id);
  } else {
    cartModel.add(product);
  }

  currentModalScreen = null;
  modal.close();
});

events.on(AppEvents.BasketOpen, () => {
  currentModalScreen = 'basket';
  modal.render({
    content: renderBasket(),
  });
  modal.open();
});

events.on<{ id: string }>(AppEvents.BasketItemRemove, ({ id }) => {
  cartModel.remove(id);
});

events.on(AppEvents.BasketCheckout, () => {
  currentModalScreen = 'order';
  modal.render({
    content: renderOrderForm(),
  });
  modal.open();
});

events.on<{ form: string; field: string; value: string }>(
  AppEvents.FormChanged,
  ({ field, value }) => {
    if (field === 'payment') {
      buyerModel.setField(
        'payment',
        value === 'card' || value === 'cash' ? value : null
      );
      return;
    }

    if (field === 'address') {
      buyerModel.setField('address', value);
      return;
    }

    if (field === 'email') {
      buyerModel.setField('email', value);
      return;
    }

    if (field === 'phone') {
      buyerModel.setField('phone', value);
    }
  }
);

events.on(AppEvents.OrderNext, () => {
  currentModalScreen = 'contacts';
  modal.render({
    content: renderContactsForm(),
  });
  modal.open();
});

events.on(AppEvents.OrderPay, () => {
  const data = buyerModel.getData();
  if (!data.payment) return;

  api.postOrder({
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    items: cartModel.getItems().map((product) => product.id),
    total: cartModel.getTotal(),
  })
    .then((res) => {
      currentModalScreen = 'success';
      modal.render({
        content: successView.render({ total: res.total }),
      });
      modal.open();

      cartModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error('Ошибка оплаты:', err);
    });
});

events.on(AppEvents.SuccessClose, () => {
  currentModalScreen = null;
  modal.close();
});

events.on(AppEvents.ModalClose, () => {
  currentModalScreen = null;
  modal.close();
});

header.render({ counter: cartModel.getCount() });

api.getProducts()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((err) => {
    console.error('Ошибка API:', err);
  });
