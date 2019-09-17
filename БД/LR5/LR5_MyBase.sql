USE STASH_MyBase;
SELECT * FROM Предмет;
SELECT Название_предмета	FROM Предмет
							WHERE Объём_лекций BETWEEN 20 AND 40;
SELECT * FROM Студент;
SELECT Телефон				FROM Студент
							WHERE Фамилия LIKE 'A%';
SELECT DISTINCT TOP(2) *	FROM Оценка;
CREATE TABLE #INFO
(
	FAMILY nvarchar(50)
);
INSERT						INTO #INFO(FAMILY)
							SELECT Фамилия FROM Студент;
SELECT * FROM #INFO;