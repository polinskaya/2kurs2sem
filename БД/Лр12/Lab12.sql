---1---
use BSTU_BUGAENKO;
go
	declare @x char(100), @y char(100);  
	declare ISIT cursor for select SUBJECTS from SUBJECTS
		where PULPIT = '����';
	open ISIT;	  
	fetch  ISIT into @x;
	print   '������� ����';   
	set @y=cast(@x as varchar(10))
	while @@fetch_status = 0                                     
       begin 
       set @y = rtrim(@x)+', '+@y;  
       fetch  ISIT into @x; 
    end;   
    print @y;        
close  ISIT;
deallocate ISIT;

---2---

---��������� ������:
DECLARE teacher CURSOR LOCAL                            
	for select TEACHER, TEACHER_NAME from TEACHER;
DECLARE @n char(10), @c varchar(100);      
	OPEN teacher;	  
	fetch  teacher into @n, @c;
	while @@fetch_status = 0
	begin
		print '-> ' + @n+ ' ' +@c;
		fetch  teacher into @n, @c;
	end
go
--- teacher ��� �� ����������:
DECLARE @n char(10), @c varchar(100);     	
	while @@fetch_status = 0
	begin
		print '--> ' + @n+ ' ' +@c;
		fetch  teacher into @n, @c;
	end  
go    

---���������� ������:
DECLARE teacher CURSOR GLOBAL                           
	for select TEACHER, TEACHER_NAME from TEACHER;
DECLARE @n char(10), @c varchar(100);      
	OPEN teacher;	  
	fetch  teacher into @n, @c;
	while @@fetch_status = 0
	begin
		print '-> ' + @n+ ' ' +@c;
		fetch  teacher into @n, @c;
	end
	close teacher;
go

DECLARE @n char(10), @c varchar(100);     	
	open teacher;
	fetch  teacher into @n, @c;
	while @@fetch_status = 0
	begin
		print '--> ' + @n+ ' ' +@c;
		fetch  teacher into @n, @c;
	end
	close teacher;
	deallocate teacher; 
go 

---3---
---����������� ������:
declare @n char(10), @c char(100);  
	declare teacher CURSOR STATIC     ---DINAMYC                         
		 for select TEACHER, TEACHER_NAME
		 from dbo.TEACHER;				   
	open teacher;
	print   '���������� ����� : '+cast(@@CURSOR_ROWS as varchar(5)); 
	go
    ----------------------------------------------------------------
	update TEACHER set TEACHER_NAME='��� ������� ��������' where GENDER = '�';
	delete TEACHER where TEACHER = '���';
	insert TEACHER(TEACHER, TEACHER_NAME, GENDER,    
                                PULPIT) 
	           values ('���','������ ����� ��������', '�', '����');
	---insert TEACHER(TEACHER, TEACHER_NAME, GENDER, PULPIT) values ('���','������� ����� �������������', '�', '����');
	---delete TEACHER where TEACHER = '���';
	-----------------------------------------------------------------
	declare @n char(10), @c char(100);  
	fetch teacher into @n, @c;     
	while @@fetch_status = 0                                    
    begin 
       print @n + ' '+ @c;      
       fetch teacher into @n, @c; 
    end;          
    close  teacher;
	deallocate teacher;
go
---4---
declare @n int, @p char(20), @pn varchar(100), @f char(10);  
declare pulpit cursor local dynamic SCROLL                               
	for select row_number() over (order by PULPIT) N, PULPIT, PULPIT_NAME, FACULTY
		from dbo.PULPIT; 
	open pulpit;
	fetch  pulpit into  @n, @p, @pn, @f;
	print '��������� ������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      
	
	fetch  LAST from  pulpit into @n, @p, @pn, @f;       
	print '��������� ������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

	fetch  PRIOR from  pulpit into @n, @p, @pn, @f;       
	print '���������� ������ �� �������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

	fetch  ABSOLUTE 3 from  pulpit into @n, @p, @pn, @f;       
	print '������ ������ �� ������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

	fetch  ABSOLUTE -3 from  pulpit into @n, @p, @pn, @f;       
	print '������ ������ �� �����: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

	fetch  RELATIVE 5 from  pulpit into @n, @p, @pn, @f;       
	print '5 ������ ������ �� �������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

	fetch  RELATIVE -5 from  pulpit into @n, @p, @pn, @f;       
	print '5 ������ ����� �� �������: ' + cast(@n as varchar(3)) + '.������� ' + @p + @pn + ' ���������: ' + @f;      

close pulpit;

---5---
declare @n5 char(10), @c5 char(100);  
	declare teacher5 CURSOR LOCAL DYNAMIC                            
		 for select TEACHER, TEACHER_NAME
		 from dbo.TEACHER FOR UPDATE;				   
	open teacher5;
	fetch teacher5 into @n5, @c5;
	update TEACHER set TEACHER_NAME='���' where current of teacher5;
	---delete TEACHER  where current of teacher5;
	close teacher5;
	go
---6---
select STUDENT.NAME AS [���], PROGRESS.SUBJECTS AS [�������], PROGRESS.NOTE AS [������] from STUDENT, PROGRESS, GROUPS 
	WHERE STUDENT.IDGROUP=GROUPS.IDGROUP AND PROGRESS.IDSTUDENT=STUDENT.IDSTUDENT AND PROGRESS.NOTE<=4

select STUDENT.NAME AS [���], PROGRESS.SUBJECTS AS [�������], PROGRESS.NOTE AS [������] from STUDENT, PROGRESS, GROUPS 
	WHERE STUDENT.IDGROUP=GROUPS.IDGROUP AND STUDENT.IDSTUDENT=1015

--6.1--
declare @a nvarchar(100), @b char(10), @c int;
	declare notes cursor local dynamic
	for select STUDENT.NAME AS [���], PROGRESS.SUBJECTS AS [�������], PROGRESS.NOTE AS [������] from STUDENT, PROGRESS, GROUPS 
	WHERE STUDENT.IDGROUP=GROUPS.IDGROUP AND STUDENT.IDSTUDENT=1015 for update;
open notes;
fetch notes into @a, @b, @c;
while @@FETCH_STATUS=0
begin
update PROGRESS set NOTE=NOTE+1 where current of notes;
end;
close notes;
go
--6.2--
declare @a nvarchar(100), @b char(10), @c int;
	declare notes cursor local dynamic
	for select STUDENT.NAME AS [���], PROGRESS.SUBJECTS AS [�������], PROGRESS.NOTE AS [������] from STUDENT, PROGRESS, GROUPS 
	WHERE STUDENT.IDGROUP=GROUPS.IDGROUP AND PROGRESS.IDSTUDENT=STUDENT.IDSTUDENT AND PROGRESS.NOTE<=4 for update;
open notes;
fetch notes into @a, @b, @c;
delete PROGRESS where current of notes;
close notes;
go