USE B_Ceh

create table RABOTNIKIS
(LICHNY_NOMER_RABOTNIKA INT not null
                 constraint PK_LICHNY_NOMER_RABOTNIKA primary key,
 FAMILIA NVARCHAR(10) not null,
 ADRES NVARCHAR(50) not null,
 TELEFON NVARCHAR(10) not null,
 STAZH INT
 ) on g1 
 insert into RABOTNIKIS   (LICHNY_NOMER_RABOTNIKA,   FAMILIA, ADRES, TELEFON, STAZH)
             values  (1,   'Иванов', 'Minsk', '2365894', 5 );
 insert into RABOTNIKIS   (LICHNY_NOMER_RABOTNIKA,   FAMILIA, ADRES, TELEFON, STAZH)
             values  (2,   'Петров', 'Grodno', '2322894', 4 );
 insert into RABOTNIKIS   (LICHNY_NOMER_RABOTNIKA,   FAMILIA, ADRES, TELEFON, STAZH)
             values  (3,   'Сидоров', 'Brest', '2312544', 8 );




CREATE table DETALI
(NOMER_DETALI INT not null
                 constraint PK_NOMER_DETALI primary key,
 NAIMENOVANIE_DETALI NVARCHAR(50) not null,
 KOLICHESTVO INT not null,
 DATA DATE not null,
 IZGOTOVITEL INT NOT NULL
		CONSTRAINT FK_IZGOTOVITEL FOREIGN KEY references RABOTNIKIS(LICHNY_NOMER_RABOTNIKA),
 ) on g2
  insert into DETALI   (NOMER_DETALI,  NAIMENOVANIE_DETALI, KOLICHESTVO, DATA, IZGOTOVITEL)
             values  (2356,   'Вал', 60, '2017-03-01', 1 );
  insert into DETALI   (NOMER_DETALI,  NAIMENOVANIE_DETALI, KOLICHESTVO, DATA, IZGOTOVITEL)
             values  (2355,   'Подшипник', 50, '2017-03-02', 2 );              
  insert into DETALI   (NOMER_DETALI,  NAIMENOVANIE_DETALI, KOLICHESTVO, DATA, IZGOTOVITEL)
             values  (2354,   'Труба', 70, '2017-03-03', 3 ); 



CREATE table OPERACII
( OPERACIA char(20) not null
                constraint PK_PROFESSION primary key,
 DETAL INT not null
                constraint FK_FACULTY foreign key 
                references DETALI(NOMER_DETALI),
 PRIZNAK_SLOZGNOSTI INT NOT NULL          
 );
   
insert into OPERACII   (OPERACIA,  DETAL, PRIZNAK_SLOZGNOSTI)
             values  ('Резка', 2354, 2 );
insert into OPERACII   (OPERACIA,  DETAL, PRIZNAK_SLOZGNOSTI)
             values  ('Шлифовка', 2355, 3 );               
insert into OPERACII   (OPERACIA,  DETAL, PRIZNAK_SLOZGNOSTI)
             values  ('Покраска', 2356, 1 );   