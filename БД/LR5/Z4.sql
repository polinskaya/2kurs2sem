USE MASTER;
GO
CREATE DATABASE Stash_UNIVER
				ON PRIMARY
				(
					NAME			= N'Stash_UNIVER_mdf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER_mdf.mdf',
					SIZE			= 5MB,
					MAXSIZE			= 10MB,
					FILEGROWTH		= 1MB
				),
				(
					NAME			= N'Stash_UNIVER_ndf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER_ndf.ndf',
					SIZE			= 5MB,
					MAXSIZE			= 10MB,
					FILEGROWTH		= 10%
				),
				FILEGROUP G1
				(
					NAME			= N'Stash_UNIVER11_ndf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER11_ndf.ndf',
					SIZE			= 10MB,
					MAXSIZE			= 15MB,
					FILEGROWTH		= 1MB
				),
				(
					NAME			= N'Stash_UNIVER12_ndf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER12_ndf.ndf',
					SIZE			= 2MB,
					MAXSIZE			= 5MB,
					FILEGROWTH		= 1MB
				),
				FILEGROUP G2
				(
					NAME			= N'Stash_UNIVER21_ndf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER21_ndf.ndf',
					SIZE			= 5MB,
					MAXSIZE			= 10MB,
					FILEGROWTH		= 1MB
				),
				(
					NAME			= N'Stash_UNIVER22_ndf', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER22_ndf.ndf',
					SIZE			= 2MB,
					MAXSIZE			= 5MB,
					FILEGROWTH		= 1MB
				)
				LOG ON
				(
					NAME			= N'Stash_UNIVER_LDF', 
					FILENAME		= N'C:\2K_II\ад\LR4\Stash_UNIVER_LDF.ldf',
					SIZE			= 5MB,
					MAXSIZE			= UNLIMITED,
					FILEGROWTH		= 1MB
				);
GO

