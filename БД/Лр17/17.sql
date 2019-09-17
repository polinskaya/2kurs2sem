---1---
	create  trigger DDL_First on database 
	for DDL_DATABASE_LEVEL_EVENTS  
          as   declare @t varchar(50)= EVENTDATA().value('(/EVENT_INSTANCE/EventType)[1]', 'varchar(50)');
          declare @t1 varchar(50)= 	 EVENTDATA().value('(/EVENT_INSTANCE/ObjectName)[1]', 'varchar(50)');
          declare @t2 varchar(50)= 	 EVENTDATA().value('(/EVENT_INSTANCE/ObjectType)[1]', 'varchar(50)'); 
  if @t1 = 'Progress' 
   begin
   print '��� �������: '+@t;
   print '��� �������: '+@t1;
   print '��� �������: '+@t2;
   raiserror( N'�������� � �������� Progress ���������', 16, 1);  
   rollback;    
   end;
 
   alter table Progress Drop Column  Note;
   
drop trigger DDL_First on database 

--2
--ROW
    use ���_Birulia_BSTU
	go
	select t.Teacher '������������_������', 
                     t.Teacher_name '����_������', 
                     p.Pulpit '���� �������'
	from  Teacher t join Pulpit p
                      on t.Pulpit = p.Pulpit 
	where p.Pulpit  = '���' for xml RAW('�������'),
      root('�������������'), elements;


--AUTO  
	select [�������].PULPIT [�������],
           [�������������].Teacher_name [���_�������������], 
           [�������������].Gender [���] 
           from  Teacher [�������������] join Pulpit [�������] 
   on [�������������].Pulpit = [�������].PULPIT
   where [�������].PULPIT in ('���', '����') 
   order by [�������]   for xml AUTO, 
   root('�������������'), elements;


--PATH	
		select [�������].PULPIT [�������],
           [�������������].Teacher_name [���_�������������], 
           [�������������].Gender [���] 
           from  Teacher [�������������] join Pulpit [�������] 
   on [�������������].Pulpit = [�������].PULPIT
   where [�������].PULPIT in ('����') 
   order by [�������]   for xml PATH, 
   root('�������������'), elements;

--3
  use ���_Birulia_BSTU
    go
    declare @h int = 1,
      @x varchar(2000) = ' <?xml version="1.0" encoding="windows-1251" ?>
       <Subjects> 
       <Subjects="����" Subjects_name="������������ ��������� � �������" Pulpit="���" /> 
       <Subjects="��" Subjects_name="���� ������" Pulpit="���" /> 
       <Subjects="���" Subjects_name="������ ������ ����������" Pulpit="���" />   
       </Subjects>';
    exec sp_xml_preparedocument @h output, @x;  -- ���������� ��������� 
    select * from openxml(@h, '/tmp_birulia_bstu/subjects', 0)
    with([Subjects] char(10), [Subjects_name] varchar(100), [Pulpit] char(10)  )       
    exec sp_xml_removedocument @h;                          -- �������� ���������     
    
    
     use ���_Birulia_BSTU
    go
    declare @h int = 0,
      @x varchar(2000) = ' <?xml version="1.0" encoding="windows-1251" ?>
       <Subjects> 
       <Subjects="����" Subjects_name="������������ ��������� � �������" Pulpit="���" /> 
       <Subjects="��" Subjects_name="���� ������" Pulpit="���" /> 
       <Subjects="���" Subjects_name="������ ������ ����������" Pulpit="���" />   
       </Subjects>';
    exec sp_xml_preparedocument @h output, @x;  -- ���������� ��������� 
      insert Subjects select [Subjects], [Subjects_name], [Pulpit] 
  from openxml(@h,'/���_birulia_bstu/subjects', 0)     
 with([Subjects] char(10), [Subjects_name] varchar(100), [Pulpit] char(10)  )      
    exec sp_xml_removedocument @h;                          -- �������� ���������
    
--4
 

create table Passport 
	(  Student     nvarchar(50) primary key,
	    Pas  xml          );

insert into Passport (Student,Pas)
    values ('������ ��������� ���������', '<pas>  <serianom>MC2466944</serianom>
	           <nom>80336688421</nom>  <adress>�.��������� 15a</adress>
	               </pas>');
insert into Passport (Student,Pas)                
    values ('�������� ����� ���������', '<pas>  <serianom>MC2478546</serianom>
	           <nom>80334521369</nom>  <adress>��. �������</adress>
	               </pas>'); 

select Student, 
pas.value('(/pas/serianom)[1]','varchar(10)') [st],
pas.query('/pas')        [pas]
from  Passport;     

--5
 use ���_Birulia_BSTU
go
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
    <xs:attribute name="����"  use="required"  >
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

 
