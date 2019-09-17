use master
go 
create database Фирма_запчастей
on primary
(name=N'Фирма_запчастей_mdf',
filename=N'Фирма_запчастей_mdf.mdf',
size=10240Kb,
maxsize=Unlimited,
filegrowth=1024Kb)
log on
(name=N'Фирма_запчастей_log',
filename=N'Фирма_запчастей_log.ldf',
size=10240Kb,
maxsize=2048Gb,
filegrowth=10%)
go