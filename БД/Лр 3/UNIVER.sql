USE BUGAENKO_UNIVER;
CREATE TABLE STUDENT
(Номер_зачетки nvarchar(10)
constraint PK_STUDENT primary key,
Фамилия_студента nvarchar(50),
Номер_группы int
)

ALTER table STUDENT ADD Дата_поступления date;

ALTER table STUDENT DROP Column Дата_поступления;

INSERT into STUDENT(Номер_зачетки, Фамилия_студента, Номер_группы)
Values	(25143, 'Петров', 7),
		(12036, 'Иванов', 8),
		(69587, 'Сорокин', 9);

SELECT *FROM STUDENT;

SELECT Номер_зачетки, Фамилия_студента From STUDENT;

SELECT count(*) From STUDENT;


UPDATE STUDENT set Номер_группы = 5;
DELETE from STUDENT Where Номер_зачетки=12036;

DROP table STUDENT;

CREATE table STUDENT_NEW(NZach nvarchar(10) primary key,
NAME nvarchar(50) unique not null,
Ngroup int);sql
ALTER Table STUDENT_NEW ADD Pol nchar(1) default 'м' check (Pol in ('м', 'ж'));

INSERT into STUDENT_NEW(NZach, NAME, Ngroup, Pol)
Values (21548, 'hyguhgl', 5, 'ж');

INSERT into STUDENT_NEW(NZach, NAME, Ngroup, Pol)
Values (12563, 'керивиа', 7, 'м');

DROP table STUDENT_NEW;