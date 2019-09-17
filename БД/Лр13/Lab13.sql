use BSTU_BUGAENKO;
---1--- РЕЖИМ НЕЯВНОЙ ТРАНЗАКЦИИ
set nocount on
if  exists (select * from  SYS.OBJECTS where OBJECT_ID=object_id(N'DBO.tempvika')) drop table tempvika;           
declare @x1 int, @flag char = 'c'; -- если поменять с на r, то таблица не сохранится

SET IMPLICIT_TRANSACTIONS ON -- включение режима неявной транзакции
	create table tempvika(x2 int ); --начало         
	insert tempvika values (1),(2),(3),(4),(5);
	set @x1 = (select count(*) from tempvika);
	print 'количество строк в таблице tempvika: ' + cast(@x1 as varchar(2));
	if @flag = 'c' commit; 
	else rollback;                              
SET IMPLICIT_TRANSACTIONS OFF   -- выключение режима неявной транзакции
	
if  exists (select * from  SYS.OBJECTS where OBJECT_ID= object_id(N'DBO.tempvika')) print 'таблица tempvika есть';  
	else print 'таблицы tempvika нет'





---2--- атомарность явной транзакции
begin try
	begin tran                 -- начало  явной транзакции
		insert FACULTY values ('АТФ', 'Автотракторный факультет');
	    --insert FACULTY values ('ПиМ', 'Факультет print-технологий и медиакоммуникаций');
	commit tran;               -- фиксация транзакции
end try
begin catch
	print 'ошибка: '+ case 
		when error_number() = 2627 and patindex('%FACULTY_PK%', error_message()) > 0 then 'дублирование товара'
		else 'неизвестная ошибка: '+ cast(error_number() as  varchar(5))+ error_message()  
	end; 
	if @@trancount > 0 rollback tran; 
end catch;

select * from FACULTY;




---3--- ОПЕРАТОР SAVETRAN
declare @point varchar(32);

begin try
	begin tran --начало явной транзакции
		set @point = 'p_1'; save tran @point;  -- контрольная точка p_1
		insert STUDENT(IDGROUP, NAME, BDAY, INFO, FOTO) values (19,'Иван', '1998-01-23', NULL, NULL),(19,'Василий', '1997-02-02', NULL, NULL),(19,'Дмитрий', '1997-02-01', NULL, NULL),(19,'Виктория', '1995-02-03', NULL, NULL);    
		set @point = 'p_2'; save tran @point; -- контрольная точка p_2 
		insert STUDENT(IDGROUP, NAME, BDAY, INFO, FOTO) values (19, 'Вася Пупкин', '1998-04-01', NULL, NULL); 
	commit tran;                                              
end try
begin catch
	print 'ошибка: '+ case 
		when error_number() = 2627 and patindex('%STUDENT_PK%', error_message()) > 0 then 'дублирование студента' 
		else 'неизвестная ошибка: '+ cast(error_number() as  varchar(5)) + error_message()  
	end; 
    if @@trancount > 0 -- если транзакция не завершена
	begin
	   print 'контрольная точка: '+ @point;
	   rollback tran @point; -- откат к последней контрольной точке
	   commit tran; -- фиксация изменений, выполненных до контрольной точки 
	end;
end catch;

select * from STUDENT where IDGROUP=19; 
delete STUDENT where IDGROUP=19; 




---4---   +неподтвержденное, +неповторяющееся, +фантомное чтение
---A
set transaction isolation level READ UNCOMMITTED 
	begin transaction --системный идентификатор процеса 
---t1
	select @@SPID[идентификатор процеса], 'insert FACULTY' 'result', *from FACULTY  
		where FACULTY='ТОВ';
	select @@SPID[идентификатор процеса], 'update FACULTY' 'result', FACULTY, FACULTY_NAME from FACULTY
		where FACULTY ='ТОВ';
commit;
---t2
---B
begin transaction ---read commited по умолчанию
	select @@SPID[идентификатор процеса]
	insert FACULTY values ('АТФ', 'Автотракторный факультет');
	---delete FACULTY where FACULTY = 'АТФ';
	update FACULTY set FACULTY='АФ'
		where FACULTY_NAME='Автотракторный факультет';
---t1
---t2
rollback;



---5---
---A -неподтверждённое +неповторяющееся +фантомное
set transaction isolation level READ COMMITTED 
	begin transaction
		select count(*) from PROFESSION
			where PROFESSION_NAME='Химические процессы';
---t1
---t2
		select 'update PROFESSION' 'result', count(*)
			from PROFESSION where PROFESSION_NAME='Химические процессы';
	commit; 

---B
begin transaction
---t1
	update PROFESSION set PROFESSION_NAME='lalal' 
		where PROFESSION_NAME='Химические процессы';
commit;
---t2




---6---
---A -неподтвержденное, - неповторяющееся, +фантомное
set transaction isolation level  REPEATABLE READ 
	begin transaction 
		select FACULTY from PROFESSION where PROFESSION='1-48 01 02';
---t1
---t2
		select case
			when FACULTY='ХТиТ' then 'insert PROFESSION' else ''
	end 'result', PROFESSION_NAME from PROFESSION where FACULTY='ХТиТ';
	commit;
---B
	begin transaction
---t1
		insert PROFESSION values('1-46 03 77', 'ИТ', 'Дизайн электронных и веб изданий', 'программист-дизайнер');
		---delete PROFESSION where PROFESSION = '1-46 03 77';
	commit;
---t2




---7---
use master;
go
use BSTU_BUGAENKO;
---A snapshot изолированность (отсутствие взаимного влияния параллельных транзакций на результаты их выполнения)
alter database BSTU_BUGAENKO set allow_snapshot_isolation on
set transaction isolation level SNAPSHOT 
	begin transaction 
		select PROFESSION from PROFESSION where PROFESSION='1-48 01 02';
---t1
		---delete PROFESSION where PROFESSION='1-48 01 09';
		insert PROFESSION values('1-48 01 09','ТОВ', 'какое-то название', 'какая-то специализация');
---t2
		select PROFESSION from PROFESSION where PROFESSION='1-48 01 09';
	commit;
---B
	begin transaction
---t1
		delete PROFESSION where PROFESSION = '1-48 01 09';
		insert PROFESSION values('1-48 01 09','ТОВ', 'Химическая технология органических веществ, материалов и изделий','инженер-химик-технолог');
		select PROFESSION from PROFESSION where PROFESSION = '1-48 01 09';
	commit;
---t2





---8---
---A -фантомное -неподтвержденное - неповторяющееся
use BSTU_BUGAENKO;
 set transaction isolation level SERIALIZABLE 
	begin transaction 
		---delete PROFESSION where PROFESSION='1-46 01 99';
		insert PROFESSION values('1-46 01 99', 'ТТЛП','Технологии и техники лесной промышленности', 'Лесоинженерное дело	инженер-технолог');
---t1
		select PROFESSION from PROFESSION where PROFESSION = '1-48 01 02';
---t2
	commit;
---B
	begin transaction
		delete PROFESSION where PROFESSION = '1-46 01 99';
		insert PROFESSION values('1-46 01 99', 'ТТЛП','Технологии и техники лесной промшленности', 'Лесоинженерное дело	инженер-технолог');
		select PROFESSION_NAME from PROFESSION where PROFESSION = '1-46 01 99';
---t1
	commit;
select PROFESSION_NAME from PROFESSION where PROFESSION = '1-46 01 99';
---t2





--9-- ВЛОЖЕННЫЕ ТРАНЗАКЦИИ
-- Транзакция, выполняющаяся в рамках другой транзакции, называется вложенной. 
-- оператор COMMIT вложенной транзакции действует только на внутренние операции вложенной транзакции; 
-- оператор ROLLBACK внешней транзакции отменяет зафиксированные операции внутренней транзакции; 
-- оператор ROLLBACK вложенной транзакции действует на операции внешней и внутренней транзакции, 
-- а также завершает обе транзакции; 
-- уровень вложенности транзакции можно определить с помощью системной функции @@TRANCOUT. 

alter database BSTU_BUGAENKO set allow_snapshot_isolation on
select (select count(*) from dbo.PULPIT where FACULTY = 'ИДиП') 'Кафедры ИДИПа', 
(select count(*) from FACULTY where FACULTY.FACULTY = 'ИДиП') 'ИДИП'; 

select * from PULPIT

begin tran ----внешняя транзакция
	begin tran ----внутренняя транзакция
	update PULPIT set PULPIT_NAME='Кафедра ИДиПа' where PULPIT.FACULTY = 'ИДиП';
	commit; ----внутренняя транзакция
if @@TRANCOUNT > 0 rollback; ----внешняя транзакция
