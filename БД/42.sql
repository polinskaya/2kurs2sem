use master
go 
create database ��������
on primary
(name=N'��������_mdf',filename=N'D:\��������_mdf.mdf',size=10240Kb,
maxsize=Unlimited,filegrowth=1024Kb),
(name=N'�������������_ndf',filename=N'D:\�������������_ndf.ndf',
size=10240Kb,maxsize=Unlimited,filegrowth=1024Kb),
(name=N'��������_ndf',filename=N'D:\��������_ndf.ndf',
size=10240Kb,maxsize=Unlimited,filegrowth=1024Kb),
filegroup FG1
( name = N'�������_fg1_1', filename = N'D:\�������_fgq-1.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
( name = N'��������_��������_fg1_2', filename = N'D:\��������_��������_fgq-2.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
   ( name = N'�����_fg1_3', filename = N'D:\�����_fgq-3.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
( name = N'����������_fg1_2', filename = N'D:\����������_fgq-4.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%),
   filegroup FG2
( name = N'����������_fg2_1', filename = N'D:\����������_fgq-1.ndf', 
   size = 10240Kb, maxsize=1Gb, filegrowth=25%)
log on
(name=N'��������_log',filename=N'��������_log.ldf',
size=10240Kb,maxsize=2048Gb,filegrowth=10%)
go