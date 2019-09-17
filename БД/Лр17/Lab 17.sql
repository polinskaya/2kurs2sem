---1---
create trigger DDL_BSTU on database for DDL_DATABASE_LEVEL_EVENTS  
as 
declare @x varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/EventType)[1]', 'varchar(50)');
declare @x1 varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/ObjectName)[1]', 'varchar(50)');
declare @x2 varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/ObjectType)[1]', 'varchar(50)');
print 'Тип события: ' + @x;
print 'Имя объекта: ' + @x1;
print 'Тип объекта: ' + @x2;
raiserror(N' Операции удаления, создания, изменения таблиц запрещены', 16, 1);  
rollback;    
return;
GO

DROP table TEACHER;
GO

--drop trigger DDL_BSTU;

---2---

--raw
select * from TEACHER where PULPIT = 'ИСИТ' for xml raw,
root('Преподаватели'), elements;
go

--auto
select p.PULPIT [кафедра], t.TEACHER_NAME [имя_преподавателя], t.GENDER [пол] 
	from  TEACHER t join PULPIT p on t.PULPIT = p.PULPIT
		where p.PULPIT in ('ИСИТ') 
			order by [Кафедра]   for xml AUTO, root('Преподаватели'), elements;
go

--path
select p.PULPIT [кафедра], t.TEACHER_NAME [имя_преподавателя], t.Gender [пол] 
	from  Teacher t join Pulpit p on t.Pulpit = p.PULPIT
		where p.PULPIT in ('ИСИТ') 
		order by [Кафедра]   for xml PATH, root('Преподаватели'), elements;
go

---3---

declare @h int = 0,
@sbj varchar(3000) = '<?xml version="1.0" encoding="windows-1251" ?>
                      <дисциплины> 
                         <дисциплина код="КГиГД" название="Компьютерная геометрия и графика" кафедра="ИТ" /> 
                         <дисциплина код="ОЗИД" название="Основы защиты информации" кафедра="ИТ" />  
                      </дисциплины>';
exec sp_xml_preparedocument @h output, @sbj;
insert "SUBJECTS" select [код], [название], [кафедра] from openxml(@h, '/дисциплины/дисциплина', 0) with([код] char(10), [название] varchar(100), [кафедра] char(20));      

---4---
insert into STUDENT(IDGROUP, NAME, BDAY, INFO) values(22, 'Самаль Антон Дмитриевич', '', 
                                                         '<студент>
														    <паспорт серия="КН" номер="2170227" дата="12.02.2012" />
															<телефон>+375447077796</телефон>
															<адрес>
															   <страна>Беларусь</страна>
															   <город>Сморгонь</город>
															   <улица>Западная</улица>
															   <дом>4</дом>
															   <квартира>28</квартира>
															</адрес>
														  </студент>');
select * from STUDENT where NAME = 'Самаль Антон Дмитриевич';
update STUDENT set INFO = '<студент>
						      <паспорт серия="КН" номер="2170227" дата="12.02.2012" />
								<телефон>+375447077796</телефон>
								<адрес>
									<страна>Беларусь</страна>
									<город>Сморгонь</город>
									<улица>Западная</улица>
									<дом>4</дом>
									<квартира>28</квартира>
								</адрес>
							</студент>'
	where NAME = 'Самаль Антон Дмитриевич';
select NAME[ФИО], INFO.value('(студент/паспорт/@серия)[1]', 'char(2)')[Серия паспорта], INFO.value('(студент/паспорт/@номер)[1]', 'varchar(20)')[Номер паспорта], INFO.query('/студент/адрес')[Адрес] from  STUDENT where NAME = 'Самаль Антон Дмитриевич';       
delete STUDENT where NAME = 'Самаль Антон Дмитриевич';

---5---

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
    <xs:attribute name="дата"  use="required">
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

alter table STUDENT alter column INFO xml(Student);
