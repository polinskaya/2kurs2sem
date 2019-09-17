CREATE VIEW OTLICHNIC
AS SELECT 
FACULTY.FACULTY_NAME [���������], 
		PROFESSION.PROFESSION_NAME [�������������], PROGRESS.SUBJECT [����������],
		STUDENT.NAME [��� ��������], PROGRESS.NOTE [������], 
		CASE
			WHEN (PROGRESS.NOTE = 10)then '10'
		END [�������]
		FROM 
			PROGRESS 
				INNER JOIN STUDENT 
				ON	PROGRESS.IDSTUDENT = STUDENT.IDSTUDENT,
			FACULTY 
				INNER JOIN PULPIT
				ON	PULPIT.FACULTY = FACULTY.FACULTY
				INNER JOIN PROFESSION
				ON FACULTY.FACULTY = PROFESSION.FACULTY
		WHERE PROGRESS.NOTE BETWEEN 10 AND 10;
	

