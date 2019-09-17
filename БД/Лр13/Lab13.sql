use BSTU_BUGAENKO;
---1--- ����� ������� ����������
set nocount on
if  exists (select * from  SYS.OBJECTS where OBJECT_ID=object_id(N'DBO.tempvika')) drop table tempvika;           
declare @x1 int, @flag char = 'c'; -- ���� �������� � �� r, �� ������� �� ����������

SET IMPLICIT_TRANSACTIONS ON -- ��������� ������ ������� ����������
	create table tempvika(x2 int ); --������         
	insert tempvika values (1),(2),(3),(4),(5);
	set @x1 = (select count(*) from tempvika);
	print '���������� ����� � ������� tempvika: ' + cast(@x1 as varchar(2));
	if @flag = 'c' commit; 
	else rollback;                              
SET IMPLICIT_TRANSACTIONS OFF   -- ���������� ������ ������� ����������
	
if  exists (select * from  SYS.OBJECTS where OBJECT_ID= object_id(N'DBO.tempvika')) print '������� tempvika ����';  
	else print '������� tempvika ���'





---2--- ����������� ����� ����������
begin try
	begin tran                 -- ������  ����� ����������
		insert FACULTY values ('���', '�������������� ���������');
	    --insert FACULTY values ('���', '��������� print-���������� � �����������������');
	commit tran;               -- �������� ����������
end try
begin catch
	print '������: '+ case 
		when error_number() = 2627 and patindex('%FACULTY_PK%', error_message()) > 0 then '������������ ������'
		else '����������� ������: '+ cast(error_number() as  varchar(5))+ error_message()  
	end; 
	if @@trancount > 0 rollback tran; 
end catch;

select * from FACULTY;




---3--- �������� SAVETRAN
declare @point varchar(32);

begin try
	begin tran --������ ����� ����������
		set @point = 'p_1'; save tran @point;  -- ����������� ����� p_1
		insert STUDENT(IDGROUP, NAME, BDAY, INFO, FOTO) values (19,'����', '1998-01-23', NULL, NULL),(19,'�������', '1997-02-02', NULL, NULL),(19,'�������', '1997-02-01', NULL, NULL),(19,'��������', '1995-02-03', NULL, NULL);    
		set @point = 'p_2'; save tran @point; -- ����������� ����� p_2 
		insert STUDENT(IDGROUP, NAME, BDAY, INFO, FOTO) values (19, '���� ������', '1998-04-01', NULL, NULL); 
	commit tran;                                              
end try
begin catch
	print '������: '+ case 
		when error_number() = 2627 and patindex('%STUDENT_PK%', error_message()) > 0 then '������������ ��������' 
		else '����������� ������: '+ cast(error_number() as  varchar(5)) + error_message()  
	end; 
    if @@trancount > 0 -- ���� ���������� �� ���������
	begin
	   print '����������� �����: '+ @point;
	   rollback tran @point; -- ����� � ��������� ����������� �����
	   commit tran; -- �������� ���������, ����������� �� ����������� ����� 
	end;
end catch;

select * from STUDENT where IDGROUP=19; 
delete STUDENT where IDGROUP=19; 




---4---   +����������������, +���������������, +��������� ������
---A
set transaction isolation level READ UNCOMMITTED 
	begin transaction --��������� ������������� ������� 
---t1
	select @@SPID[������������� �������], 'insert FACULTY' 'result', *from FACULTY  
		where FACULTY='���';
	select @@SPID[������������� �������], 'update FACULTY' 'result', FACULTY, FACULTY_NAME from FACULTY
		where FACULTY ='���';
commit;
---t2
---B
begin transaction ---read commited �� ���������
	select @@SPID[������������� �������]
	insert FACULTY values ('���', '�������������� ���������');
	---delete FACULTY where FACULTY = '���';
	update FACULTY set FACULTY='��'
		where FACULTY_NAME='�������������� ���������';
---t1
---t2
rollback;



---5---
---A -��������������� +��������������� +���������
set transaction isolation level READ COMMITTED 
	begin transaction
		select count(*) from PROFESSION
			where PROFESSION_NAME='���������� ��������';
---t1
---t2
		select 'update PROFESSION' 'result', count(*)
			from PROFESSION where PROFESSION_NAME='���������� ��������';
	commit; 

---B
begin transaction
---t1
	update PROFESSION set PROFESSION_NAME='lalal' 
		where PROFESSION_NAME='���������� ��������';
commit;
---t2




---6---
---A -����������������, - ���������������, +���������
set transaction isolation level  REPEATABLE READ 
	begin transaction 
		select FACULTY from PROFESSION where PROFESSION='1-48 01 02';
---t1
---t2
		select case
			when FACULTY='����' then 'insert PROFESSION' else ''
	end 'result', PROFESSION_NAME from PROFESSION where FACULTY='����';
	commit;
---B
	begin transaction
---t1
		insert PROFESSION values('1-46 03 77', '��', '������ ����������� � ��� �������', '�����������-��������');
		---delete PROFESSION where PROFESSION = '1-46 03 77';
	commit;
---t2




---7---
use master;
go
use BSTU_BUGAENKO;
---A snapshot ��������������� (���������� ��������� ������� ������������ ���������� �� ���������� �� ����������)
alter database BSTU_BUGAENKO set allow_snapshot_isolation on
set transaction isolation level SNAPSHOT 
	begin transaction 
		select PROFESSION from PROFESSION where PROFESSION='1-48 01 02';
---t1
		---delete PROFESSION where PROFESSION='1-48 01 09';
		insert PROFESSION values('1-48 01 09','���', '�����-�� ��������', '�����-�� �������������');
---t2
		select PROFESSION from PROFESSION where PROFESSION='1-48 01 09';
	commit;
---B
	begin transaction
---t1
		delete PROFESSION where PROFESSION = '1-48 01 09';
		insert PROFESSION values('1-48 01 09','���', '���������� ���������� ������������ �������, ���������� � �������','�������-�����-��������');
		select PROFESSION from PROFESSION where PROFESSION = '1-48 01 09';
	commit;
---t2





---8---
---A -��������� -���������������� - ���������������
use BSTU_BUGAENKO;
 set transaction isolation level SERIALIZABLE 
	begin transaction 
		---delete PROFESSION where PROFESSION='1-46 01 99';
		insert PROFESSION values('1-46 01 99', '����','���������� � ������� ������ ��������������', '�������������� ����	�������-��������');
---t1
		select PROFESSION from PROFESSION where PROFESSION = '1-48 01 02';
---t2
	commit;
---B
	begin transaction
		delete PROFESSION where PROFESSION = '1-46 01 99';
		insert PROFESSION values('1-46 01 99', '����','���������� � ������� ������ �������������', '�������������� ����	�������-��������');
		select PROFESSION_NAME from PROFESSION where PROFESSION = '1-46 01 99';
---t1
	commit;
select PROFESSION_NAME from PROFESSION where PROFESSION = '1-46 01 99';
---t2





--9-- ��������� ����������
-- ����������, ������������� � ������ ������ ����������, ���������� ���������. 
-- �������� COMMIT ��������� ���������� ��������� ������ �� ���������� �������� ��������� ����������; 
-- �������� ROLLBACK ������� ���������� �������� ��������������� �������� ���������� ����������; 
-- �������� ROLLBACK ��������� ���������� ��������� �� �������� ������� � ���������� ����������, 
-- � ����� ��������� ��� ����������; 
-- ������� ����������� ���������� ����� ���������� � ������� ��������� ������� @@TRANCOUT. 

alter database BSTU_BUGAENKO set allow_snapshot_isolation on
select (select count(*) from dbo.PULPIT where FACULTY = '����') '������� �����', 
(select count(*) from FACULTY where FACULTY.FACULTY = '����') '����'; 

select * from PULPIT

begin tran ----������� ����������
	begin tran ----���������� ����������
	update PULPIT set PULPIT_NAME='������� �����' where PULPIT.FACULTY = '����';
	commit; ----���������� ����������
if @@TRANCOUNT > 0 rollback; ----������� ����������
