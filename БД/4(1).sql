use master
go 
create database �����_���������
on primary
(name=N'�����_���������_mdf',
filename=N'�����_���������_mdf.mdf',
size=10240Kb,
maxsize=Unlimited,
filegrowth=1024Kb)
log on
(name=N'�����_���������_log',
filename=N'�����_���������_log.ldf',
size=10240Kb,
maxsize=2048Gb,
filegrowth=10%)
go