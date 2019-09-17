---1---

create table TR_AUDIT
(
ID int identity,
STMT varchar(20)
check (STMT in ('INS', 'DEL', 'UPD')),
TRNAME varchar(50),
CC varchar(300)
)
go

create  trigger TR_TEACHER_INS 
	on TEACHER after INSERT  
	as
declare @x1 char(10), @x2 varchar(100), @x3 char(1), @x4 char(20), @in varchar(300);
print 'Операция вставки';
	set @x1 = (select TEACHER from INSERTED);
	set @x2= (select TEACHER_NAME from INSERTED);
	set @x3= (select GENDER from INSERTED);
	set @x4 = (select PULPIT from INSERTED);
	set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;
insert into TR_AUDIT(STMT, TRNAME, CC)  
         values('INS', 'TR_TEACHER_INS', @in);	         
return;  
go
select * from TR_AUDIT;

---2---

	insert into  TEACHER values('nw', 'new', 'м', 'ИСиТ');
	select * from TR_AUDIT


create  trigger TR_TEACHER_DEL on TEACHER after DELETE  
as
declare @x1 char(10), @x2 varchar(100), @x3 char(1), @x4 char(20), @in varchar(300);
print 'Операция удаления';
	set @x1 = (select TEACHER from DELETED);
	set @x2= (select TEACHER_NAME from DELETED);
	set @x3= (select GENDER from DELETED);
	set @x4 = (select PULPIT from DELETED);
	set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;

	insert into TR_AUDIT(STMT, TRNAME, CC)  
           values('DEL', 'TR_TEACHER_DEL', @in);	         
    return;  
go

	  delete TEACHER where TEACHER='nw'
	  select * from TR_AUDIT
	  ---drop trigger TR_TEACHER_DEL 
---3---

alter  trigger TR_TEACHER_DEL 
on TEACHER after UPDATE  
as
declare @x1 char(10), @x2 varchar(100), @x3 char(1), @x4 char(20), @in varchar(300);
declare @ins int = (select count(*) from inserted),
              @del int = (select count(*) from deleted); 

print 'Операция обновления';
set @x1 = (select TEACHER from INSERTED);
set @x2= (select TEACHER_NAME from INSERTED);
set @x3= (select GENDER from INSERTED);
set @x4 = (select PULPIT from INSERTED);
set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;

set @x1 = (select TEACHER from deleted);
set @x2= (select TEACHER_NAME from DELETED);
set @x3= (select GENDER from DELETED);
set @x4 = (select PULPIT from DELETED);
set @in =@in + '' + @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;

insert into TR_AUDIT(STMT, TRNAME, CC)  
       values('UPD', 'TR_TEACHER_UPD', @in);	         
return;  
go

update TEACHER set GENDER = 'ж' where TEACHER='nw'
select * from TR_AUDIT

delete from TR_AUDIT where STMT = 'UPD'

---4---

create trigger TR_TEACHER   
on TEACHER after INSERT, DELETE, UPDATE
 as declare @x1 char(10), @x2 varchar(100), @x3 char(1), @x4 char(20), @in varchar(300);
	  declare @ins int = (select count(*) from inserted),
              @del int = (select count(*) from deleted); 
   if  @ins > 0 and  @del = 0  begin print 'Событие: INSERT';
      set @x1 = (select TEACHER from INSERTED);
      set @x2= (select TEACHER_NAME from INSERTED);
      set @x3= (select GENDER from INSERTED);
	  set @x4 = (select PULPIT from INSERTED);
      set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;

      insert into TR_AUDIT(STMT, TRNAME, CC)  
                            values('INS', 'TR_TEACHER_INS', @in);	
	 end; else		  	 
    if @ins = 0 and  @del > 0  begin print 'Событие: DELETE';
      set @x1 = (select TEACHER from DELETED);
      set @x2= (select TEACHER_NAME from DELETED);
      set @x3= (select GENDER from DELETED);
	  set @x4 = (select PULPIT from DELETED);
      set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;
      insert into TR_AUDIT(STMT, TRNAME, CC)  
                            values('DEL', 'TR_TEACHER_DEL', @in);
	  end; else	  
    if @ins > 0 and  @del > 0  begin print 'Событие: UPDATE'; 
      set @x1 = (select TEACHER from INSERTED);
      set @x2= (select TEACHER_NAME from INSERTED);
      set @x3= (select GENDER from INSERTED);
	  set @x4 = (select PULPIT from INSERTED);
      set @in = @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;
      set @x1 = (select TEACHER from deleted);
      set @x2= (select TEACHER_NAME from DELETED);
      set @x3= (select GENDER from DELETED);
	  set @x4 = (select PULPIT from DELETED);
      set @in =@in + '' + @x1+' '+ @x2 +' '+ @x3+ ' ' +@x4;

      insert into TR_AUDIT(STMT, TRNAME, CC)  
                            values('UPD', 'TR_TEACHER_UPD', @in); 
	  end;  return;  

	  delete TEACHER where TEACHER='nw'
	  insert into  TEACHER values('nw', 'new', 'м', 'ИСиТ');
	  update TEACHER set GENDER = 'ж' where TEACHER='nw'
	  select * from TR_AUDIT

---5---

alter table AUDITORIUM
add constraint AUDITORIUM_CAPACITY check(AUDITORIUM_CAPACITY<=200)
go 	

update AUDITORIUM set AUDITORIUM_CAPACITY = 250 where AUDITORIUM = '200';


---6---

Insert into FACULTY(FACULTY) values ('new')
go   
create trigger AUD_AFTER_DEL1 on FACULTY after DELETE  
as print 'AUD_AFTER_DEL1';
return;  
go 
create trigger AUD_AFTER_DEL2 on FACULTY after DELETE  
as print 'AUD_AFTER_DEL2';
return;  
go  
create trigger AUD_AFTER_DEL3 on FACULTY after DELETE  
as print 'AUD_AFTER_DEL3';
return;  
go    
---drop trigger AUD_AFTER_DEL2
delete FACULTY from FACULTY where FACULTY='new';
select t.name, e.type_desc 
	from sys.triggers  t join  sys.trigger_events e  on t.object_id = e.object_id  
		where OBJECT_NAME(t.parent_id)='FACULTY' and e.type_desc = 'DELETE' ;  

exec  SP_SETTRIGGERORDER @triggername = 'AUD_AFTER_DEL3', 
	                        @order='First', @stmttype = 'DELETE';
exec  SP_SETTRIGGERORDER @triggername = 'AUD_AFTER_DEL2', 
	                        @order='Last', @stmttype = 'DELETE';

select t.name, e.type_desc 
  from sys.triggers  t join  sys.trigger_events e  on t.object_id = e.object_id  
  where OBJECT_NAME(t.parent_id)='FACULTY' and e.type_desc = 'DELETE' ; 
  GO

---7---

	create trigger PTran 
	on PULPIT after INSERT, DELETE, UPDATE  
	as declare @c int = (select count (*) from PULPIT); 	 
		if (@c >26) 
		begin
		raiserror('Общая количество кафедр не может быть >26', 10, 1);
		rollback; 
	end; 
	return;          

	insert into PULPIT(PULPIT) values ('new')

---8---

	create trigger F_INSTEAD_OF
	on FACULTY instead of DELETE
	as 
raiserror (N'Удаление запрещено', 10, 1);
	return;
	 delete FACULTY where FACULTY = 'ИДиП'

	 drop trigger F_INSTEAD_OF
	 drop trigger PTran
	 drop trigger TR_TEACHER
	 drop trigger TR_TEACHER_DEL