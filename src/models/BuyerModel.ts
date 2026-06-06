import { IBuyerData, PaymentMethod, ValidationErrors } from '../types';

export class BuyerModel {
  protected payment: PaymentMethod | null = null;
  protected address: string = '';
  protected email: string = '';
  protected phone: string = '';

  setField<K extends keyof IBuyerData>(field: K, value: IBuyerData[K]): void {
    if (field === 'payment') this.payment = value as PaymentMethod | null;
    else if (field === 'address') this.address = value as string;
    else if (field === 'email') this.email = value as string;
    else if (field === 'phone') this.phone = value as string;
  }

  getData(): IBuyerData {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  validate(): ValidationErrors {
    const errors: Partial<Record<keyof IBuyerData, string>> = {};
    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.address.trim()) errors.address = 'Укажите адрес доставки';
    if (!this.email.trim()) errors.email = 'Укажите email';
    if (!this.phone.trim()) errors.phone = 'Укажите телефон';
    return errors;
  }
}