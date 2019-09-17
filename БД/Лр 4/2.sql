use master  
go
create database B_BSTU
on primary
( name = 'B_BSTU_mdf', filename = N'E:\ËÐ4\B_BSTU_mdf.mdf', 
   size = 5120Kb, maxsize=10240KB, filegrowth=1024Kb),
( name = 'B_BSTU_ndf', filename = 'E:\ËÐ4\B_BSTU_ndf.ndf', 
   size = 5120KB, maxsize=10240KB, filegrowth=10%),

filegroup G1
( name = 'B_BSTU11_ndf', filename = 'E:\ËÐ4\B_BSTU11.ndf', 
   size = 10240Kb, maxsize=15Mb, filegrowth=1Mb),
( name = 'B_BSTU12_ndf', filename = 'E:\ËÐ4\B_BSTU12.ndf', 
   size = 2Mb, maxsize=5Mb, filegrowth=1Mb),

filegroup G2
( name = 'B_BSTU21_ndf', filename = 'E:\ËÐ4\BSTU_fgq-1.ndf', 
   size = 5Mb, maxsize=10Mb, filegrowth=1Mb),
( name = 'B_BSTU22_ndf', filename = 'E:\ËÐ4\BSTU_fgq-2.ndf', 
   size = 2Mb, maxsize=5Mb, filegrowth=1Mb)

log on
( name = 'B_BSTU_log', filename='E:\ËÐ4\B_BSTU_log.ldf',       
   size=5Mb,  maxsize=UNLIMITED, filegrowth=1MB)
GO

