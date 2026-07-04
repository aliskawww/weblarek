export const AppEvents = {
  CatalogChanged: 'catalog:changed',
  PreviewChanged: 'preview:changed',
  BasketChanged: 'basket:changed',
  BuyerChanged: 'buyer:changed',

  ProductOpen: 'product:open',
  CardAction: 'card:action',

  BasketOpen: 'basket:open',
  BasketItemRemove: 'basket:item-remove',
  BasketCheckout: 'basket:checkout',

  SuccessClose: 'success:close',

  OrderNext: 'order:next',
  OrderPay: 'order:pay',
  FormChanged: 'form:changed',

  ModalOpen: 'modal:open',
  ModalClose: 'modal:close',
} as const;

export type AppEventName = typeof AppEvents[keyof typeof AppEvents];
