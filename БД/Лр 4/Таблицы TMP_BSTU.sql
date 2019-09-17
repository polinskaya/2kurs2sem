use TMPB_BSTU;
CREATE table FACULTY
(FACULTY	char(10) NOT NULL constraint PK_FACULTY primary key,
FACULTY_NAME varchar(50) default '???'
);

CREATE table PULPIT
(PULPIT		char(20) NOT NULL,
			constraint PK_PULPIT 
			primary key(PULPIT),
PULPIT_NAME varchar(100) NOT NULL,
FACULTY		char(10) NOT NULL
			constraint FK_FACULTY foreign key
			references FACULTY(FACULTY)
);

CREATE table TEACHER
(TEACHER	char(10)  NOT NULL constraint PK_TEACHER primary key,
TEACHER_NAME varchar(100),
GENDER		char(1) check (GENDER in ('ì', 'æ')),
PULPIT		char(20) NOT NULL constraint TEACHER_PULPIT_FK foreign key
			references   PULPIT(PULPIT)
);

CREATE table SUBJECT
(SUBJECT char(10) not null constraint PK_SUBJECT primary key,
SUBJECT_NAME varchar(100) unique,
PULPIT		char(20) not null constraint FK_SUBJECT foreign key
			references PULPIT(PULPIT)
);

 CREATE table AUDITORIUM_TYPE
( AUDITORIUM_TYPE char(10) not null primary key,  
  AUDITORIUM_TYPENAME varchar(30)
);

CREATE table AUDITORIUM 
( AUDITORIUM char(20) primary key,  
 AUDITORIUM_TYPE char(10) not null 
references AUDITORIUM_TYPE(AUDITORIUM_TYPE),
AUDITORIUM_CAPACITY  integer default 1 check (AUDITORIUM_CAPACITY between 1 and 300),
AUDITORIUM_NAME varchar(50)
);

create table PROFESSION
(  PROFESSION      char(20) constraint PROFESSION_PK  primary key,
   FACULTY         char(10) constraint PROFESSION_FACULTY_FK foreign key 
                            references FACULTY(FACULTY),
   PROFESSION_NAME varchar(100),    QUALIFICATION   varchar(50)   
); 


create table GROUPS 
( IDGROUP     integer  identity(1,1) constraint GROUP_PK  primary key,              
 FACULTY     char(10) constraint  GROUPS_FACULTY_FK foreign key         
                      references FACULTY(FACULTY), 
 PROFESSION  char(20) constraint  GROUPS_PROFESSION_FK foreign key         
                      references PROFESSION(PROFESSION),
 YEAR_FIRST  smallint  check (YEAR_FIRST<=YEAR(GETDATE())),                  
);

DROP database TMPB_BSTU;