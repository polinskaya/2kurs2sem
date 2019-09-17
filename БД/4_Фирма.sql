CREATE DATABASE Фирма_продажи_запчастей;
CREATE TABLE Товары_продажа
(
Название_детали nvarchar(20) NOT NULL,
Артикул int unique,
Количество_деталей int  NOT NULL,
Цена real ,
Примечание nvarchar(50) constraint PK_Производитель_Примечание  primary key (Примечание),
)
CREATE TABLE Поставщики_товаров
(
Название_компании nvarchar(20) NOT NULL,
Код_поставщика int primary key,
Телефон numeric(9,0),
Адрес nvarchar(MAX),
)
CREATE TABLE Заказчики_продукции
(
Заказчик nvarchar(20) NOT NULL,
ID_Заказчика int primary key,
Телефон numeric(9,0),
Адрес nvarchar(MAX),
)
CREATE TABLE Заказы_деталей
(
Номер_заказа int unique,
ID_Заказчика int primary key,
Артикул int unique,
Код_поставщика int,
Дата_заказа date,
)