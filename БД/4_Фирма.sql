CREATE DATABASE �����_�������_���������;
CREATE TABLE ������_�������
(
��������_������ nvarchar(20) NOT NULL,
������� int unique,
����������_������� int  NOT NULL,
���� real ,
���������� nvarchar(50) constraint PK_�������������_����������  primary key (����������),
)
CREATE TABLE ����������_�������
(
��������_�������� nvarchar(20) NOT NULL,
���_���������� int primary key,
������� numeric(9,0),
����� nvarchar(MAX),
)
CREATE TABLE ���������_���������
(
�������� nvarchar(20) NOT NULL,
ID_��������� int primary key,
������� numeric(9,0),
����� nvarchar(MAX),
)
CREATE TABLE ������_�������
(
�����_������ int unique,
ID_��������� int primary key,
������� int unique,
���_���������� int,
����_������ date,
)