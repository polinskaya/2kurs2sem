USE BUGAENKO_UNIVER;
CREATE TABLE STUDENT
(�����_������� nvarchar(10)
constraint PK_STUDENT primary key,
�������_�������� nvarchar(50),
�����_������ int
)

ALTER table STUDENT ADD ����_����������� date;

ALTER table STUDENT DROP Column ����_�����������;

INSERT into STUDENT(�����_�������, �������_��������, �����_������)
Values	(25143, '������', 7),
		(12036, '������', 8),
		(69587, '�������', 9);

SELECT *FROM STUDENT;

SELECT �����_�������, �������_�������� From STUDENT;

SELECT count(*) From STUDENT;


UPDATE STUDENT set �����_������ = 5;
DELETE from STUDENT Where �����_�������=12036;

DROP table STUDENT;

CREATE table STUDENT_NEW(NZach nvarchar(10) primary key,
NAME nvarchar(50) unique not null,
Ngroup int);sql
ALTER Table STUDENT_NEW ADD Pol nchar(1) default '�' check (Pol in ('�', '�'));

INSERT into STUDENT_NEW(NZach, NAME, Ngroup, Pol)
Values (21548, 'hyguhgl', 5, '�');

INSERT into STUDENT_NEW(NZach, NAME, Ngroup, Pol)
Values (12563, '�������', 7, '�');

DROP table STUDENT_NEW;