CREATE EXTERNAL TABLE $SchemaQualifiedObjectName$ 
(  
	 [Id] INT NOT NULL 
)
WITH  
(  
	LOCATION = '$SomeExternalTableLocation$',  
	DATA_SOURCE = [DataSource1],  
	FILE_FORMAT = [FileFormat1] 
) 
