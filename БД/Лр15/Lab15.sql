---1---

create function COUNT_STUDENTS1(@faculty varchar(20)) returns int
as begin
declare @x1 int = 0;
set @x1 = (select count(IDSTUDENT) 
	from FACULTY inner join GROUPS 
		on FACULTY.FACULTY = GROUPS.FACULTY inner join STUDENT 
		on GROUPS.IDGROUP = STUDENT.IDGROUP 
			where FACULTY.FACULTY LIKE @faculty);
return @x1;
end;
--drop function COUNT_STUDENTS
go

declare @col int = dbo.COUNT_STUDENTS1('ИТ');
print 'Количество студентов: ' + cast(@col as varchar(4));
go

alter function COUNT_STUDENTS1(@faculty varchar(20) = null, @prof varchar(20) = '1-89 02 02') returns int
as begin
declare @x2 int = 0;
set @x2 = (select count(IDSTUDENT) 
	from FACULTY inner join "GROUPS" 
		on FACULTY.FACULTY = "GROUPS".FACULTY inner join STUDENT 
		on "GROUPS".IDGROUP = STUDENT.IDGROUP 
			where FACULTY.FACULTY = @faculty and "GROUPS".PROFESSION = @prof);
return @x2;
end;
go

declare @col int = dbo.COUNT_STUDENTS1('ЛХФ', '1-89 02 02');
print 'Количество студентов: ' + cast(@col as varchar(4));
go


---2---
create function FSUBJECTS(@p varchar(20)) returns varchar(300)
as begin
declare @x varchar(10), @d varchar(300) = 'Дисциплины: ';
declare sub cursor local static for select "SUBJECTS" from "SUBJECTS" where PULPIT LIKE @p;
open sub;
	fetch sub into @x;
	while @@fetch_status = 0
begin
	set @d = @d + ', ' + rtrim(@x);
	fetch sub into @x;
end;
return @d;
end;
--DROP FUNCTION FSUBJECTS
go

select PULPIT, dbo.FSUBJECTS(PULPIT) from "SUBJECTS";
go


---3---
create function FFACPUL(@f char(10), @p char(10))  returns table 
      as return 
          select F.Faculty, F.Faculty_name, P.PULPIT  
          from Faculty F left outer join PULPIT P
          on F.Faculty = P.FACULTY
          where F.Faculty = isnull(@f,F.Faculty) 
          and P.PULPIT = isnull(@p, P.PULPIT);
-- DROP FUNCTION FFACPUL
go
select * from dbo.FFACPUL(null, null);
select * from dbo.FFACPUL('ТОВ', null);
select * from dbo.FFACPUL(null, 'ХПД');
select * from dbo.FFACPUL('ТОВ', 'ХПДP');
go


---4---

create function FCTEACHER(@p varchar(20)) returns int
as begin
declare @x int = (select count(TEACHER) from TEACHER where PULPIT = isnull(@p, PULPIT));
return @x;
end;
go
-- DROP FUNCTION FCTEACHER
 
select PULPIT, dbo.FCTEACHER(PULPIT)[Количество преподавателей] from TEACHER;
select dbo.FCTEACHER(null)[Общее количество преподавателей];
go

---5---

create function COUNT_PULPIT(@p varchar(20)) returns int
as begin
declare @x int = 0;
set @x = (select count(PULPIT) from PULPIT where FACULTY = @p);
return @x;
end;
-- DROP FUNCTION COUNT_PULPIT
go


create function COUNT_GROUP(@f varchar(20)) returns int
as begin
declare @rc int = 0;
set @rc = (select count(IDGROUP) from "GROUPS" where FACULTY like @f);
return @rc;
end;
-- DROP FUNCTION COUNT_GROUP
go


create function COUNT_PROFESSION(@f varchar(20)) returns int
as begin
declare @rc int = 0;
set @rc = (select count(PROFESSION) from PROFESSION where FACULTY like @f);
return @rc;
end;
-- DROP FUNCTION COUNT_PROFESSION
go

create function FACULTY_REPORT(@c int) returns @fr table([Факультет] varchar(50), [Количество кафедр] int, [Количество групп]  int, [Количество студентов] int, [Количество специальностей] int)
as begin 
	declare cc cursor static for select FACULTY from FACULTY where dbo.COUNT_STUDENTS1(FACULTY, default)> @c; 
	declare @f varchar(30);
	open cc;  
		fetch cc into @f;
		while @@fetch_status = 0
		begin
		insert @fr values(@f, dbo.COUNT_PULPIT(@f), dbo.COUNT_GROUP(@f), dbo.COUNT_STUDENTS1(@f, default), dbo.COUNT_PROFESSION(@f)); 
		fetch cc into @f;  
		end;   
	return; 
end;
-- DROP FUNCTION FACULTY_REPORT
go