---1--- процедура без параметров

create procedure PSUBJECT1
as begin
declare @x_1 int = (select count(*) from "SUBJECTS");
select SUBJECTS [КОД], SUBJECTS_NAME [ДИСЦИПЛИНА], PULPIT [КАФЕДРА] from "SUBJECTS";
return @x_1;
end;

declare @y_1 int;
exec @y_1 = PSUBJECT1;	--вызов процедуры
print 'Количество предметов: ' + cast(@y_1 as varchar(3));
go

drop procedure PSUBJECT1
go

--2
alter procedure PSUBJECT1 
			@p varchar(20),		--входной параметр
			@c int output		--выходной
as begin
select * from "SUBJECTS" where "SUBJECTS" = @p;
set @c = @@rowcount;
return @c;
end;


declare @x_2 int;
exec @x_2 = PSUBJECT1 @p = 'СУБД', @c = @x_2 output;
print 'Количество предметов: ' + cast(@x_2 as varchar(3));
go


--3-- без выходного параметра (источник строк для добавления в некотурую таблицу)
alter procedure PSUBJECT1 
				@p varchar(20) --входной параметр
as begin
select * from "SUBJECTS" where "SUBJECTS" = @p;
end;

create table #SUBJECT(Код_предмета varchar(20), Название_предмета varchar(100), Кафедра varchar(20));

insert #SUBJECT exec PSUBJECT1 @p = 'БД';
insert #SUBJECT exec PSUBJECT1 @p = 'СУБД';
select * from #SUBJECT;
go


--4--
create procedure PAUDITORIUM_INSERT 
				@a char(20),
				@n varchar(50), 
				@c int = 0,
				@t char(10)
as begin 
begin try
	insert into AUDITORIUM(AUDITORIUM, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY, AUDITORIUM_NAME) 
							values(@a, @n, @c, @t);
	return 1;
end try
begin catch
	print 'Номер ошибки: ' + cast(error_number() as varchar(6));
	print 'Сообщение: ' + error_message();
	print 'Уровень: ' + cast(error_severity() as varchar(6));
	print 'Метка: ' + cast(error_state() as varchar(8));
	print 'Номер строки: ' + cast(error_line() as varchar(8));
if error_procedure() is not null   
	print 'Имя процедуры: ' + error_procedure();
return -1;
end catch;
end;


declare @p int;  
exec @p = PAUDITORIUM_INSERT @a = '100-3', @n = 'ЛК', @c = 200, @t = '100-3'; 
print 'Код ошибки: ' + cast(@p as varchar(3));
go

select * from AUDITORIUM

--drop procedure PAUDITORIUM_INSERT


--5--
create procedure SUBJECT_REPORT1 
					@p char(10) = 0
as begin
	declare @x int;
begin try
	declare @с char(10), @r varchar(100) = '';
	declare sbjct cursor for 
		select "SUBJECTS" from "SUBJECTS" where PULPIT = @p;
		if not exists(select "SUBJECTS" from "SUBJECTS" where PULPIT = @p)
			raiserror('Ошибка', 11, 1); --11 - обработка ошибок
		else open sbjct;
		fetch sbjct into @с;
		print 'Предметы: ';
		while @@fetch_status = 0
			begin
				set @r = rtrim(@с) + ', ' + @r;  
				set @x = @x + 1;
				fetch sbjct into @с;
			end
		print @r;
		close sbjct;
		return @x;
end try

begin catch
	print 'Ошибка в параметрах' 
	if error_procedure() is not null   
		print 'Имя процедуры: ' + error_procedure();
		print 'Номер строки: ' + cast(error_line() as varchar(8));
	return @x;
end catch;
end;


declare @y int;  
exec @y = SUBJECT_REPORT1 @p ='ОХ';  
print 'Количество предметов: ' + cast(@y as varchar(3));
go


drop procedure SUBJECT_REPORT1
go

--6-- 
create procedure PAUDITORIUM_INSERTX @a char(20), @n varchar(50), @c int = 0, @t char(10), @tn varchar(50)
as begin
declare @rc int = 1;
begin try
set transaction isolation level serializable;          
begin tran
insert into AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values(@n, @tn);
exec @rc = PAUDITORIUM_INSERT @a, @n, @c, @t;
commit tran;
return @rc;
end try
begin catch
print 'Номер ошибки: ' + cast(error_number() as varchar(6));
print 'Сообщение: ' + error_message();
print 'Уровень: ' + cast(error_severity() as varchar(6));
print 'Метка: ' + cast(error_state() as varchar(8));
print 'Номер строки: ' + cast(error_line() as varchar(8));
if error_procedure() is not  null   
print 'Имя процедуры: ' + error_procedure(); 
if @@trancount > 0 rollback tran ; 
return -1;
end catch;
end;


declare @k3 int;  
exec @k3 = PAUDITORIUM_INSERTX '201', @n = 'КB', @c = 101, @t = '201', @tn = 'Поточк'; 
print 'Код ошибки: ' + cast(@k3 as varchar(3));  

--drop procedure PAUDITORIUM_INSERTX



--процедура изменит оценку студенту в зав-сти от средней оценки в группе. если выше средняя, то + 1 балл, ниже - -1