import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModels';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';

// Создание экземпляров всех классов
const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const apiInstance = new Api(API_URL);
const api = new LarekApi(apiInstance);

// Тестирование методов моделей данных
console.log('ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ');

// Тестирование ProductsModel
console.log('\nТестирование ProductsModel:');
productsModel.setItems(apiProducts.items);
console.log('setItems() - товары загружены (тестовые данные):', productsModel.getItems().length, 'шт.');
console.log('getItems() - список товаров:', productsModel.getItems());
console.log('getProductById() - товар по id:', productsModel.getProductById(apiProducts.items[0].id));
productsModel.setPreview(apiProducts.items[0].id);
console.log('setPreview() - выбран товар для предпросмотра');
console.log('getPreview() - товар для предпросмотра:', productsModel.getPreview());

// Тестирование CartModel
console.log('\nТестирование CartModel:');
const testProduct = apiProducts.items[0];
const testProduct2 = apiProducts.items[1];
cartModel.add(testProduct);
console.log('add() - добавлен товар, в корзине:', cartModel.getCount(), 'шт.');
cartModel.add(testProduct2);
console.log('add() - добавлен ещё один товар, в корзине:', cartModel.getCount(), 'шт.');
console.log('getItems() - список id товаров в корзине:', cartModel.getItems());
console.log('getTotal() - общая стоимость:', cartModel.getTotal());
console.log('contains() - проверка наличия товара:', cartModel.contains(testProduct.id));
cartModel.remove(testProduct.id);
console.log('remove() - удалён товар, в корзине:', cartModel.getCount(), 'шт.');
cartModel.clear();
console.log('clear() - корзина очищена, в корзине:', cartModel.getCount(), 'шт.');

//Тестирование BuyerModel
console.log('\nТестирование BuyerModel:');
buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'ул. Тестовая, д.1');
buyerModel.setField('email', 'test@test.ru');
buyerModel.setField('phone', '+79991234567');
console.log('setField() - данные установлены');
console.log('getData() - данные покупателя:', buyerModel.getData());
console.log('validate() - ошибки валидации:', buyerModel.validate());
buyerModel.setField('email', '');
console.log('setField() - email изменён на пустую строку');
console.log('validate() - ошибки валидации:', buyerModel.validate());
buyerModel.clear();
console.log('clear() - данные очищены, getData():', buyerModel.getData());

// Запрос к серверу и сохранение в модель
console.log('\nЗАПРОС К СЕРВЕРУ');
api.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
        console.log('Каталог загружен с сервера:', productsModel.getItems().length, 'товаров');
        console.log('Первый товар с сервера:', productsModel.getItems()[0]);
        console.log('\nВсе тесты пройдены успешно!');
    })
    .catch(err => {
        console.error('Ошибка API:', err.message);
        console.log('Использованы тестовые данные из data.ts');
        console.log('\nТесты на тестовых данных выполнены, API временно недоступен.');
    });