---С помощью системной процедуры SP_HELPINDEX можно получить перечень индексов, связанных с заданной (параметр процедуры) таблицей.
---1---
exec sp_helpindex 'AUDITORIUM'
exec sp_helpindex 'AUDITORIUM_TYPE'
exec sp_helpindex 'FACULTY'
exec sp_helpindex 'GROUPS'
exec sp_helpindex 'PROFESSION'
exec sp_helpindex 'PULPIT'
exec sp_helpindex 'STUDENT'
exec sp_helpindex 'SUBJECTS'
exec sp_helpindex 'TEACHER'

---2--- кластеризованные индексы
CREATE table  #local2
 (   number int,  symbol varchar(100) );
GO

SET nocount on;      --не выводить сообщения о вводе строк
DECLARE @i2 int=0; 
WHILE @i2<1000
  begin 
  INSERT #local2(number, symbol) 
               values(floor(20000*RAND()), REPLICATE('строка', 10));
  IF(@i2 % 100=0) print @i2;     --вывести сообщение
  SET @i2=@i2+1;
  end;
GO

SELECT * from #local2 WHERE number between 1500 and 2500 ORDER BY symbol
checkpoint;  --фиксация БД
DBCC DROPCLEANBUFFERS;  --очистить буферный кэш

CREATE clustered index #local_CL on #local2(symbol asc) ---кластеризованный индекс

DROP TABLE #local2
DROP INDEX #local_CL on #local2

---3--- некластеризованные индексы

CREATE TABLE #tmp3
(	i_1 int IDENTITY(0,1), 	i_2 int, 	i_3 varchar(10)) 

SET NOCOUNT ON;	--не выводить сообщения о вводе строк
DECLARE @i INT = 0;
WHILE (@i<10000)
	BEGIN
	INSERT #tmp3(i_2, i_3) VALUES (FLOOR(666*rand()), 'Database');
	SET @i=@i+1;
	END;
	
SELECT COUNT(*) FROM #tmp3
SELECT * FROM #tmp3
CREATE INDEX #tmp3_NOCL ON #tmp3(i_1, i_2);	---некластеризованный составной неуникальный

SELECT * FROM #tmp3 WHERE i_1 BETWEEN 100 AND 900 AND i_2<10000;
SELECT * FROM #tmp3 ORDER BY i_1, i_2;

SELECT * FROM #tmp3 WHERE i_1=124 AND i_2<1000;	---индекс применится

DROP TABLE #tmp3
DROP INDEX #tmp3_NOCL ON #tmp3
GO

---4--- некластеризованный индекс покрытия

CREATE TABLE #tmp4
(	i_1 int IDENTITY(0,1), 	i_2 int, 	i_3 varchar(10)) 

SET NOCOUNT ON;	--не выводить сообщения о вводе строк
DECLARE @i INT = 0;
WHILE (@i<10000)
	BEGIN
	INSERT #tmp4(i_2, i_3) VALUES (FLOOR(666*rand()), 'Database');
	SET @i=@i+1;
	END;
SELECT * FROM #tmp4 WHERE i_1 BETWEEN 100 AND 900;
CREATE  index #tmp4_X on #tmp4(i_2) INCLUDE (i_1)

DROP INDEX #tmp4_X ON #tmp4
DROP TABLE #tmp4
GO
---5--- некластеризованный фильтруемый индекс

CREATE TABLE #tmp5
(	i_1 int IDENTITY(0,1), 	i_2 int, 	i_3 varchar(10)) 

SET NOCOUNT ON;	--не выводить сообщения о вводе строк
DECLARE @i INT = 0;
WHILE (@i<10000)
	BEGIN
	INSERT #tmp5(i_2, i_3) VALUES (FLOOR(666*rand()), 'Database');
	SET @i=@i+1;
	END;
GO
SELECT * FROM #tmp5 WHERE i_1 BETWEEN 100 AND 900;
CREATE  index #tmp5_X on #tmp5(i_2) INCLUDE (i_1)

DROP INDEX #tmp5_X ON #tmp4
DROP TABLE #tmp5

---6---
CREATE TABLE #tmp6
(	i_1 int IDENTITY(0,1), 	i_2 int, 	i_3 varchar(10)) 

SET NOCOUNT ON;	--не выводить сообщения о вводе строк
DECLARE @i INT = 0;
WHILE (@i<1000)
	BEGIN
	INSERT #tmp6(i_2, i_3) VALUES (FLOOR(666*rand()), 'Database');
	SET @i=@i+1;
	END;
GO

CREATE INDEX #TMP6_X ON #tmp6(i_2)
go
---информация о степени фрагментации индекса:
SELECT name [Индекс], avg_fragmentation_in_percent [Фрагментация (%)] FROM SYS.dm_db_index_physical_stats(DB_iD(N'TEMPDB'), OBJECT_ID(N'#tmp_6'), NULL,NULL,NULL) ss 
	JOIN tempbd.sys.indexes ii on ss.object_id = ii.object_id and ss.index_id = ii.index_id 
	where name is not null;

INSERT top(10000) #tmp6(i_2, i_3) select i_2, i_3 from #tmp6;

ALTER INDEX #TMP6_X ON #tmp6 REORGANIZE;

ALTER INDEX #TMP6_X ON #tmp6 REBUILD WITH (ONLINE=OFF)
go
---7---
DROP INDEX #TMP6_X on #tmp6
CREATE index #TMP6_X on #tmp6(i_2)with (fillfactor = 65);

INSERT top(50)percent into #tmp6(i_2, i_3) select i_2, i_3  from #tmp6;

SELECT name [Индекс], avg_fragmentation_in_percent [Фрагментация (%)] FROM SYS.dm_db_index_physical_stats(DB_iD(N'TEMPDB'), OBJECT_ID(N'#tmp6'), NULL,NULL,NULL) ss 
	JOIN tempbd.sys.indexes ii on ss.object_id = ii.object_id and ss.index_id = ii.index_id 
	where name is not null;

---8---
CREATE TABLE #tmp7
(	i_1 int IDENTITY(0,1), 	i_2 int, 	i_3 varchar(10)) 

SET NOCOUNT ON;	--не выводить сообщения о вводе строк
DECLARE @i INT = 0;
WHILE (@i<1000)
	BEGIN
	INSERT #tmp7(i_2, i_3) VALUES (FLOOR(666*rand()), 'Database');
	SET @i=@i+1;
	END;
GO

DROP table #tmp7
TRUNCATE table #tmp7
DELETE #tmp7
GO
---9---
CREATE VIEW КОЛИЧЕСТВО_КАФЕДР
AS SELECT
	[FACULTY_NAME] AS [Наименование факультета],
	COUNT([PULPIT]) AS [Количество кафедр]
FROM PULPIT INNER JOIN FACULTY ON PULPIT.FACULTY=FACULTY.FACULTY
GROUP BY FACULTY_NAME
SELECT * FROM КОЛИЧЕСТВО_КАФЕДР

DROP VIEW КОЛИЧЕСТВО_КАФЕДР