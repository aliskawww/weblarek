export type PaymentMethod = 'card' | 'cash';

export interface IBuyerData {
  payment: PaymentMethod | null;
  address: string;
  email: string;
  phone: string;
}

export class BuyerModel {
  protected _payment: PaymentMethod | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';

  setField<K extends keyof IBuyerData>(field: K, value: IBuyerData[K]): void {
    if (field === 'payment') this._payment = value as PaymentMethod | null;
    else if (field === 'address') this._address = value as string;
    else if (field === 'email') this._email = value as string;
    else if (field === 'phone') this._phone = value as string;
  }

  getData(): IBuyerData {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  validate(): Partial<Record<keyof IBuyerData, string>> {
    const errors: Partial<Record<keyof IBuyerData, string>> = {};
    if (!this._payment) errors.payment = 'Не выбран способ оплаты';
    if (!this._address.trim()) errors.address = 'Укажите адрес доставки';
    if (!this._email.trim()) errors.email = 'Укажите email';
    if (!this._phone.trim()) errors.phone = 'Укажите телефон';
    return errors;
  }
}