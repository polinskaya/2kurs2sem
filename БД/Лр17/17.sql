---1---
	create  trigger DDL_First on database 
	for DDL_DATABASE_LEVEL_EVENTS  
          as   declare @t varchar(50)= EVENTDATA().value('(/EVENT_INSTANCE/EventType)[1]', 'varchar(50)');
          declare @t1 varchar(50)= 	 EVENTDATA().value('(/EVENT_INSTANCE/ObjectName)[1]', 'varchar(50)');
          declare @t2 varchar(50)= 	 EVENTDATA().value('(/EVENT_INSTANCE/ObjectType)[1]', 'varchar(50)'); 
  if @t1 = 'Progress' 
   begin
   print 'Тип события: '+@t;
   print 'Имя объекта: '+@t1;
   print 'Тип объекта: '+@t2;
   raiserror( N'операции с таблицей Progress запрещены', 16, 1);  
   rollback;    
   end;
 
   alter table Progress Drop Column  Note;
   
drop trigger DDL_First on database 

--2
--ROW
    use ТМР_Birulia_BSTU
	go
	select t.Teacher 'Наименование_товара', 
                     t.Teacher_name 'Цена_товара', 
                     p.Pulpit 'Цена продажи'
	from  Teacher t join Pulpit p
                      on t.Pulpit = p.Pulpit 
	where p.Pulpit  = 'ТДП' for xml RAW('Кафедра'),
      root('Преподаватели'), elements;


--AUTO  
	select [Кафедра].PULPIT [кафедра],
           [Преподаватель].Teacher_name [имя_преподавателя], 
           [Преподаватель].Gender [пол] 
           from  Teacher [Преподаватель] join Pulpit [Кафедра] 
   on [Преподаватель].Pulpit = [Кафедра].PULPIT
   where [Кафедра].PULPIT in ('ТДП', 'ЭТиМ') 
   order by [Кафедра]   for xml AUTO, 
   root('Преподаватели'), elements;


--PATH	
		select [Кафедра].PULPIT [кафедра],
           [Преподаватель].Teacher_name [имя_преподавателя], 
           [Преподаватель].Gender [пол] 
           from  Teacher [Преподаватель] join Pulpit [Кафедра] 
   on [Преподаватель].Pulpit = [Кафедра].PULPIT
   where [Кафедра].PULPIT in ('ИСИТ') 
   order by [Кафедра]   for xml PATH, 
   root('Преподаватели'), elements;

--3
  use ТМР_Birulia_BSTU
    go
    declare @h int = 1,
      @x varchar(2000) = ' <?xml version="1.0" encoding="windows-1251" ?>
       <Subjects> 
       <Subjects="КГиГ" Subjects_name="Компьютерная геометрия и графика" Pulpit="РИТ" /> 
       <Subjects="БД" Subjects_name="Базы данных" Pulpit="РИТ" /> 
       <Subjects="ОЗИ" Subjects_name="Основы защиты информации" Pulpit="РИТ" />   
       </Subjects>';
    exec sp_xml_preparedocument @h output, @x;  -- подготовка документа 
    select * from openxml(@h, '/tmp_birulia_bstu/subjects', 0)
    with([Subjects] char(10), [Subjects_name] varchar(100), [Pulpit] char(10)  )       
    exec sp_xml_removedocument @h;                          -- удаление документа     
    
    
     use ТМР_Birulia_BSTU
    go
    declare @h int = 0,
      @x varchar(2000) = ' <?xml version="1.0" encoding="windows-1251" ?>
       <Subjects> 
       <Subjects="КГиГ" Subjects_name="Компьютерная геометрия и графика" Pulpit="РИТ" /> 
       <Subjects="БД" Subjects_name="Базы данных" Pulpit="РИТ" /> 
       <Subjects="ОЗИ" Subjects_name="Основы защиты информации" Pulpit="РИТ" />   
       </Subjects>';
    exec sp_xml_preparedocument @h output, @x;  -- подготовка документа 
      insert Subjects select [Subjects], [Subjects_name], [Pulpit] 
  from openxml(@h,'/тмр_birulia_bstu/subjects', 0)     
 with([Subjects] char(10), [Subjects_name] varchar(100), [Pulpit] char(10)  )      
    exec sp_xml_removedocument @h;                          -- удаление документа
    
--4
 

create table Passport 
	(  Student     nvarchar(50) primary key,
	    Pas  xml          );

insert into Passport (Student,Pas)
    values ('Бируля Анастасия сергеевна', '<pas>  <serianom>MC2466944</serianom>
	           <nom>80336688421</nom>  <adress>д.Заболотье 15a</adress>
	               </pas>');
insert into Passport (Student,Pas)                
    values ('Карнеева Дарья Сергеевна', '<pas>  <serianom>MC2478546</serianom>
	           <nom>80334521369</nom>  <adress>ул. Левкова</adress>
	               </pas>'); 

select Student, 
pas.value('(/pas/serianom)[1]','varchar(10)') [st],
pas.query('/pas')        [pas]
from  Passport;     

--5
 use ТМР_Birulia_BSTU
go
create xml schema collection Student as 
N'<?xml version="1.0" encoding="utf-16" ?>
<xs:schema attributeFormDefault="unqualified" 
   elementFormDefault="qualified"
   xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="студент">
<xs:complexType><xs:sequence>
<xs:element name="паспорт" maxOccurs="1" minOccurs="1">
  <xs:complexType>
    <xs:attribute name="серия" type="xs:string" use="required" />
    <xs:attribute name="номер" type="xs:unsignedInt" use="required"/>
    <xs:attribute name="дата"  use="required"  >
	<xs:simpleType>  <xs:restriction base ="xs:string">
		<xs:pattern value="[0-9]{2}.[0-9]{2}.[0-9]{4}"/>
	 </xs:restriction> 	</xs:simpleType>
     </xs:attribute>
  </xs:complexType>
</xs:element>
<xs:element maxOccurs="3" name="телефон" type="xs:unsignedInt"/>
<xs:element name="адрес">   <xs:complexType><xs:sequence>
   <xs:element name="страна" type="xs:string" />
   <xs:element name="город" type="xs:string" />
   <xs:element name="улица" type="xs:string" />
   <xs:element name="дом" type="xs:string" />
   <xs:element name="квартира" type="xs:string" />
</xs:sequence></xs:complexType>  </xs:element>
</xs:sequence></xs:complexType>
</xs:element></xs:schema>';

 
