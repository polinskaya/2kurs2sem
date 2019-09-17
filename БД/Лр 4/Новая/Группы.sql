use master  
go
create database B_Ceh
on primary
( name = 'B_Ceh_mdf', filename = N'E:\ËÐ4\B_Ceh_mdf.mdf', 
   size = 5120Kb, maxsize=10240KB, filegrowth=1024Kb),
( name = 'B_Ceh_ndf', filename = 'E:\ËÐ4\B_Ceh_ndf.ndf', 
   size = 5120KB, maxsize=10240KB, filegrowth=10%),

filegroup G1
( name = 'B_Ceh11_ndf', filename = 'E:\ËÐ4\B_Ceh11.ndf', 
   size = 10240Kb, maxsize=15Mb, filegrowth=1Mb),
( name = 'B_Ceh12_ndf', filename = 'E:\ËÐ4\B_Ceh12.ndf', 
   size = 2Mb, maxsize=5Mb, filegrowth=1Mb),

filegroup G2
( name = 'B_Ceh21_ndf', filename = 'E:\ËÐ4\B_Ceh_fgq-1.ndf', 
   size = 5Mb, maxsize=10Mb, filegrowth=1Mb),
( name = 'B_Ceh22_ndf', filename = 'E:\ËÐ4\B_Ceh_fgq-2.ndf', 
   size = 2Mb, maxsize=5Mb, filegrowth=1Mb)

log on
( name = 'B_Ceh_log', filename='E:\ËÐ4\B_Ceh_log.ldf',       
   size=5Mb,  maxsize=UNLIMITED, filegrowth=1MB)
GO

