use master
go 
create database Запчасти
on primary
(name=N'Запчасти_mdf',filename=N'D:\Запчасти_mdf.mdf',size=10240Kb,
maxsize=Unlimited,filegrowth=1024Kb),
(name=N'Производитель_ndf',filename=N'D:\Производитель_ndf.ndf',
size=10240Kb,maxsize=Unlimited,filegrowth=1024Kb),
(name=N'Заказчик_ndf',filename=N'D:\Заказчик_ndf.ndf',
size=10240Kb,maxsize=Unlimited,filegrowth=1024Kb),
filegroup FG1
( name = N'Артикул_fg1_1', filename = N'D:\Артикул_fgq-1.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
( name = N'Название_компании_fg1_2', filename = N'D:\Название_компании_fgq-2.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
   ( name = N'Адрес_fg1_3', filename = N'D:\Адрес_fgq-3.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
( name = N'Количество_fg1_2', filename = N'D:\Количество_fgq-4.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
   filegroup FG2
( name = N'Примечание_fg2_1', filename = N'D:\Примечание_fgq-1.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%)
log on
(name=N'Запчасти_log',filename=N'Запчасти_log.ldf',
size=10240Kb,maxsize=2048Gb,filegrowth=10%)
go