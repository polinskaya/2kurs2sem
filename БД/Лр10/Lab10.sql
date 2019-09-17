USE BSTU_BUGAENKO;

---1---
DECLARE @ch char(3)='ME',
		@vch varchar(15)='YOU&ME',
		@dt datetime,
		@t time,
		@i int,
		@si smallint,
		@ti tinyint,
		@ny numeric(12,5);
SET @dt=GETDATE();
SET @t='23:45';
SELECT @t t
Select @i=CAST(sum(Auditorium_capacity)as int)from Auditorium;
Select @si=CAST(AVG(Note)as smallint)from Progress;
Select @ti=CAST(Sum(Note)as tinyint)from Progress;
Print 'Char = '+cast(@ch as varchar(15));
Print 'Varchar = '+@vch;
Print 'Date&time = '+cast(@dt as varchar(15));
Select @i 'int',@si 'smallint',@ti 'tinyint',@ny 'numeric(12,5)';

---2---
DECLARE @AudCap numeric(10,2) = (select SUM(Auditorium_capacity) as int from Auditorium),
		@KolCap numeric(10,2), @KolCapL numeric(10,2), @AvgCap numeric(10,2),@AllCap numeric(10,2), @Proc numeric(10,2);
if @AudCap>200
begin
   Select @KolCap=cast(COUNT(Auditorium)as numeric(10,2)) from Auditorium;
   Select @AvgCap=CAST(AVG(Auditorium_capacity)as numeric(10,2))from Auditorium;
   Select @KolCapL=cast(COUNT(Auditorium)as numeric(10,2)) from Auditorium where Auditorium_capacity<@AvgCap;
   Set @Proc=(@KolCapL/@KolCap) * 100;
    Print 'Количество аудиторий = '+ cast(@KolCap as varchar(10)); 
    Print 'Средняя вместимость= '+ cast(@AvgCap as varchar(10)); 	
	Print 'Количество аудиторий с вместимостью ниже средней  = '+ cast(@KolCapL as varchar(10));
	Print 'Их процент = '+ cast(@Proc as varchar(10)) + '%';
end
else 
	 Select @AllCap=CAST(Sum(Auditorium_capacity)as numeric(10,2))from Auditorium;
	 Print 'Общая вместимость'+ cast(@AllCap as varchar(10));

---3---
Print 'Число обработанных строк --> '+cast(@@ROWCOUNT as varchar(50));
Print 'Версия сервера --> '+cast(@@VERSION as varchar(50));
Print 'Системный идентификатор процесса, назначенный сервером текущему подключению --> '+cast(@@SPID  as varchar(50));
Print 'Код последней ошибки --> '+cast(@@ERROR  as varchar(50));
Print 'Имя сервера --> '+cast(@@SERVERNAME as varchar(50));
Print 'Уровень вложенной транзакции --> '+cast(@@TRANCOUNT  as varchar(50));
Print 'Проверка результата считывания строк результирующего набора --> '+cast(@@FETCH_STATUS as varchar(50));
Print 'Уровень вложенности текущей процедуры --> '+cast( @@NESTLEVEL  as varchar(50));

---4---
--4.1
DECLARE @t41 float = 4.1,@x41 float =7.2 ,@z41 float;
if (@t41>@x41) set @z41=sin(@t41)*sin(@t41)
if (@t41<@x41) set @z41=4*(@t41+@x41)
else set @z41=1-EXP(@x41-2);
Print 't= '+cast(@t41 as varchar(10));
Print 'x= '+cast(@x41 as varchar(10));		
Print 'z= '+cast(@z41 as varchar(10));

DECLARE @t42 float = 4.1,@x42 float =3.2 ,@z42 float;
if (@t42>@x42) set @z41=sin(@t42)*sin(@t42)
if (@t42<@x42) set @z41=4*(@t42+@x42)
else set @z42=1-EXP(@x42-2);
Print 't= '+cast(@t42 as varchar(10));
Print 'x= '+cast(@x42 as varchar(10));
Print 'z= '+cast(@z42 as varchar(10));

DECLARE @t43 float = 4.1,@x43 float =4.1 ,@z43 float;
if (@t43>@x43) set @z43=sin(@t43)*sin(@t43)
if (@t43<@x43) set @z43=4*(@t43+@x43)
else set @z43=1-EXP(@x43-2);
Print 't= '+cast(@t43 as varchar(10));
Print 'x= '+cast(@x43 as varchar(10));		
Print 'z= '+cast(@z43 as varchar(10));

--4.2
Declare @Fam varchar(10)='BUGAENKO',@Name varchar(10)='VIKTORYA',@Otch varchar(10)='VYACHESLAVOVNA';
Print @Fam+' '+@Name+' '+@Otch;
Print @Fam+' '+convert(varchar(1),@Name)+'. '+convert(varchar(1),@Otch)+'. ';

---5---
Declare @x5 int = (select count(*) from TEACHER);
if @x5 > 50	print '@x5 > 50';
else		print '@x5 < 50';
if @x5 > 25	print '@x5 > 25';
else		print '@x5 < 25';
if @x5 > 5	print '@x5 > 5';
else		print '@x5 < 5';
print '@x5 = '+cast(@x5 as varchar(5));

---6---
SELECT  *
 FROM (select Case 
   when Note  between 4 and  6 then '4-6'
   when Note  between 7 and  8  then '7-8'
   else '9-10'
   end  [Пределы оценок], COUNT (*) [Количество]    
FROM Progress Group by Case 
   when Note  between 4 and  6 then '4-6'
   when Note  between 7 and  8  then '7-8'
   else '9-10'
   end ) as T
ORDER BY  Case [Пределы оценок]
   when '9-10' then 3
   when '7-8' then 2
   when '4-6' then 1
   else 0
   end 
    
---7---
CREATE table  #7
( Строка varchar(50) default 'Число',  
Номер int,  
Число int );      
DECLARE @i7 int=0; 
WHILE @i7<10
  begin 
  INSERT #7 (Номер, Число) 
               values(@i7,floor(150*rand()));
  SET @i7=@i7+1;
  end;
  Select * from #7
  Drop table #7

---8(9)---
DECLARE @x int = 1
     print @x+2
     print @x+3
     RETURN
print @x+3

---9(10)---
begin TRY
update dbo.STUDENT set IDGROUP = '2.5' where IDSTUDENT= '1000'
end try
begin CATCH
print 'Номер ошибки '
print ERROR_NUMBER()
print ERROR_MESSAGE()
print 'Ошибка в строке '
print ERROR_LINE()
print 'Уровень опасности '
print ERROR_SEVERITY()
print 'Метка ошибки '
print ERROR_STATE()
end catch

---10(11)---
DECLARE @i11 int=0; 
CREATE table  #local11 (i11 int, dt11 datetime)  
WHILE @i11<3
    begin 
    waitfor delay '00:00:01'
    SET @i11=@i11+1;
    INSERT #local11(i11, dt11) values(@i11, sysdatetime())
   end;
    SELECT * from #local11
drop table #local11

---11(12)---
CREATE table  ##global
( Строка varchar(50) default 'Число',  
Номер int,  
Число int );      
DECLARE @i12 int=1; 
WHILE @i12<5
  begin 
  INSERT ##global (Номер, Число) 
               values(@i12,floor(150*rand()));
  SET @i12=@i12+1;
  end;
  Select * from ##global

  Drop table ##global
	