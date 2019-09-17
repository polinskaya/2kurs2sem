---1--- ��������� ��� ����������

create procedure PSUBJECT1
as begin
declare @x_1 int = (select count(*) from "SUBJECTS");
select SUBJECTS [���], SUBJECTS_NAME [����������], PULPIT [�������] from "SUBJECTS";
return @x_1;
end;

declare @y_1 int;
exec @y_1 = PSUBJECT1;	--����� ���������
print '���������� ���������: ' + cast(@y_1 as varchar(3));
go

drop procedure PSUBJECT1
go

--2
alter procedure PSUBJECT1 
			@p varchar(20),		--������� ��������
			@c int output		--��������
as begin
select * from "SUBJECTS" where "SUBJECTS" = @p;
set @c = @@rowcount;
return @c;
end;


declare @x_2 int;
exec @x_2 = PSUBJECT1 @p = '����', @c = @x_2 output;
print '���������� ���������: ' + cast(@x_2 as varchar(3));
go


--3-- ��� ��������� ��������� (�������� ����� ��� ���������� � ��������� �������)
alter procedure PSUBJECT1 
				@p varchar(20) --������� ��������
as begin
select * from "SUBJECTS" where "SUBJECTS" = @p;
end;

create table #SUBJECT(���_�������� varchar(20), ��������_�������� varchar(100), ������� varchar(20));

insert #SUBJECT exec PSUBJECT1 @p = '��';
insert #SUBJECT exec PSUBJECT1 @p = '����';
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
	print '����� ������: ' + cast(error_number() as varchar(6));
	print '���������: ' + error_message();
	print '�������: ' + cast(error_severity() as varchar(6));
	print '�����: ' + cast(error_state() as varchar(8));
	print '����� ������: ' + cast(error_line() as varchar(8));
if error_procedure() is not null   
	print '��� ���������: ' + error_procedure();
return -1;
end catch;
end;


declare @p int;  
exec @p = PAUDITORIUM_INSERT @a = '100-3', @n = '��', @c = 200, @t = '100-3'; 
print '��� ������: ' + cast(@p as varchar(3));
go

select * from AUDITORIUM

--drop procedure PAUDITORIUM_INSERT


--5--
create procedure SUBJECT_REPORT1 
					@p char(10) = 0
as begin
	declare @x int;
begin try
	declare @� char(10), @r varchar(100) = '';
	declare sbjct cursor for 
		select "SUBJECTS" from "SUBJECTS" where PULPIT = @p;
		if not exists(select "SUBJECTS" from "SUBJECTS" where PULPIT = @p)
			raiserror('������', 11, 1); --11 - ��������� ������
		else open sbjct;
		fetch sbjct into @�;
		print '��������: ';
		while @@fetch_status = 0
			begin
				set @r = rtrim(@�) + ', ' + @r;  
				set @x = @x + 1;
				fetch sbjct into @�;
			end
		print @r;
		close sbjct;
		return @x;
end try

begin catch
	print '������ � ����������' 
	if error_procedure() is not null   
		print '��� ���������: ' + error_procedure();
		print '����� ������: ' + cast(error_line() as varchar(8));
	return @x;
end catch;
end;


declare @y int;  
exec @y = SUBJECT_REPORT1 @p ='��';  
print '���������� ���������: ' + cast(@y as varchar(3));
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
print '����� ������: ' + cast(error_number() as varchar(6));
print '���������: ' + error_message();
print '�������: ' + cast(error_severity() as varchar(6));
print '�����: ' + cast(error_state() as varchar(8));
print '����� ������: ' + cast(error_line() as varchar(8));
if error_procedure() is not  null   
print '��� ���������: ' + error_procedure(); 
if @@trancount > 0 rollback tran ; 
return -1;
end catch;
end;


declare @k3 int;  
exec @k3 = PAUDITORIUM_INSERTX '201', @n = '�B', @c = 101, @t = '201', @tn = '������'; 
print '��� ������: ' + cast(@k3 as varchar(3));  

--drop procedure PAUDITORIUM_INSERTX



--��������� ������� ������ �������� � ���-��� �� ������� ������ � ������. ���� ���� �������, �� + 1 ����, ���� - -1