---1---
create trigger DDL_BSTU on database for DDL_DATABASE_LEVEL_EVENTS  
as 
declare @x varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/EventType)[1]', 'varchar(50)');
declare @x1 varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/ObjectName)[1]', 'varchar(50)');
declare @x2 varchar(50) = EVENTDATA().value('(/EVENT_INSTANCE/ObjectType)[1]', 'varchar(50)');
print '��� �������: ' + @x;
print '��� �������: ' + @x1;
print '��� �������: ' + @x2;
raiserror(N' �������� ��������, ��������, ��������� ������ ���������', 16, 1);  
rollback;    
return;
GO

DROP table TEACHER;
GO

--drop trigger DDL_BSTU;

---2---

--raw
select * from TEACHER where PULPIT = '����' for xml raw,
root('�������������'), elements;
go

--auto
select p.PULPIT [�������], t.TEACHER_NAME [���_�������������], t.GENDER [���] 
	from  TEACHER t join PULPIT p on t.PULPIT = p.PULPIT
		where p.PULPIT in ('����') 
			order by [�������]   for xml AUTO, root('�������������'), elements;
go

--path
select p.PULPIT [�������], t.TEACHER_NAME [���_�������������], t.Gender [���] 
	from  Teacher t join Pulpit p on t.Pulpit = p.PULPIT
		where p.PULPIT in ('����') 
		order by [�������]   for xml PATH, root('�������������'), elements;
go

---3---

declare @h int = 0,
@sbj varchar(3000) = '<?xml version="1.0" encoding="windows-1251" ?>
                      <����������> 
                         <���������� ���="�����" ��������="������������ ��������� � �������" �������="��" /> 
                         <���������� ���="����" ��������="������ ������ ����������" �������="��" />  
                      </����������>';
exec sp_xml_preparedocument @h output, @sbj;
insert "SUBJECTS" select [���], [��������], [�������] from openxml(@h, '/����������/����������', 0) with([���] char(10), [��������] varchar(100), [�������] char(20));      

---4---
insert into STUDENT(IDGROUP, NAME, BDAY, INFO) values(22, '������ ����� ����������', '', 
                                                         '<�������>
														    <������� �����="��" �����="2170227" ����="12.02.2012" />
															<�������>+375447077796</�������>
															<�����>
															   <������>��������</������>
															   <�����>��������</�����>
															   <�����>��������</�����>
															   <���>4</���>
															   <��������>28</��������>
															</�����>
														  </�������>');
select * from STUDENT where NAME = '������ ����� ����������';
update STUDENT set INFO = '<�������>
						      <������� �����="��" �����="2170227" ����="12.02.2012" />
								<�������>+375447077796</�������>
								<�����>
									<������>��������</������>
									<�����>��������</�����>
									<�����>��������</�����>
									<���>4</���>
									<��������>28</��������>
								</�����>
							</�������>'
	where NAME = '������ ����� ����������';
select NAME[���], INFO.value('(�������/�������/@�����)[1]', 'char(2)')[����� ��������], INFO.value('(�������/�������/@�����)[1]', 'varchar(20)')[����� ��������], INFO.query('/�������/�����')[�����] from  STUDENT where NAME = '������ ����� ����������';       
delete STUDENT where NAME = '������ ����� ����������';

---5---

create xml schema collection Student as 
N'<?xml version="1.0" encoding="utf-16" ?>
<xs:schema attributeFormDefault="unqualified" 
   elementFormDefault="qualified"
   xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="�������">
<xs:complexType><xs:sequence>
<xs:element name="�������" maxOccurs="1" minOccurs="1">
  <xs:complexType>
    <xs:attribute name="�����" type="xs:string" use="required" />
    <xs:attribute name="�����" type="xs:unsignedInt" use="required"/>
    <xs:attribute name="����"  use="required">
	<xs:simpleType>  <xs:restriction base ="xs:string">
		<xs:pattern value="[0-9]{2}.[0-9]{2}.[0-9]{4}"/>
	 </xs:restriction> 	</xs:simpleType>
     </xs:attribute>
  </xs:complexType>
</xs:element>
<xs:element maxOccurs="3" name="�������" type="xs:unsignedInt"/>
<xs:element name="�����">   <xs:complexType><xs:sequence>
   <xs:element name="������" type="xs:string" />
   <xs:element name="�����" type="xs:string" />
   <xs:element name="�����" type="xs:string" />
   <xs:element name="���" type="xs:string" />
   <xs:element name="��������" type="xs:string" />
</xs:sequence></xs:complexType>  </xs:element>
</xs:sequence></xs:complexType>
</xs:element></xs:schema>';

alter table STUDENT alter column INFO xml(Student);
