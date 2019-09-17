SELECT Distinct Номер_заказа,Артикул FROM Заказы 
Where Дата_заказа<'27.02.2016' Order by Артикул  ;
SELECT Distinct Top(3) Название_детали FROM Товары ;
SELECT Distinct Top(3) ID_Заказчика,Артикул,Дата_заказа 
FROM Заказы  Order by Дата_заказа Desc;
SELECT Distinct ID_Заказчика,Артикул,Дата_заказа FROM Заказы 
Where Дата_заказа Between '27.02.2016'And'05.11.2015';
SELECT Distinct  Артикул FROM Заказы Where ID_заказчика In(135,164);
SELECT Заказчик FROM Заказчики Where Заказчик Like 'И%';