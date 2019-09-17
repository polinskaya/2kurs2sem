USE Stash_UNIVER;
--1
SELECT AUDITORIUM.AUDITORIUM, AUDITORIUM_TYPE.AUDITORIUM_TYPENAME	
								FROM AUDITORIUM
								INNER JOIN
								AUDITORIUM_TYPE
								ON AUDITORIUM.AUDITORIUM_TYPE = AUDITORIUM_TYPE.AUDITORIUM_TYPE;
--2
SELECT AUDITORIUM.AUDITORIUM, AUDITORIUM_TYPE.AUDITORIUM_TYPENAME	
								FROM AUDITORIUM
								INNER JOIN
								AUDITORIUM_TYPE
								ON AUDITORIUM.AUDITORIUM_TYPE = AUDITORIUM_TYPE.AUDITORIUM_TYPE
								WHERE AUDITORIUM_TYPENAME LIKE '%���������%';
--3
SELECT AUDITORIUM.AUDITORIUM, AUDITORIUM_TYPE.AUDITORIUM_TYPENAME
								FROM AUDITORIUM, AUDITORIUM_TYPE
								WHERE AUDITORIUM.AUDITORIUM_TYPE = AUDITORIUM_TYPE.AUDITORIUM_TYPE;
SELECT AUDITORIUM.AUDITORIUM, AUDITORIUM_TYPE.AUDITORIUM_TYPENAME
								FROM AUDITORIUM, AUDITORIUM_TYPE
								WHERE AUDITORIUM.AUDITORIUM_TYPE = AUDITORIUM_TYPE.AUDITORIUM_TYPE
										AND AUDITORIUM_TYPENAME LIKE '%���������%';
--4
/*
SELECT FACULTY.FACULTY_NAME [���������], PULPIT.PULPIT_NAME [�������],
		PROFESSION.PROFESSION_NAME [�������������], PROGRESS.SUBJECT [����������],
		STUDENT.NAME [��� ��������], PROGRESS.NOTE [������], 
		CASE
			WHEN (PROGRESS.NOTE = 6) then '�����'
			WHEN (PROGRESS.NOTE = 7) then '����'
			WHEN (PROGRESS.NOTE = 8) then '������'
		END [�������]
								FROM PROGRESS
								INNER JOIN
								STUDENT
								ON PROGRESS.IDSTUDENT = STUDENT.IDSTUDENT
								AND PROGRESS.NOTE BETWEEN 6 AND 8
								--INNER JOIN
								--SUBJECT
								--ON PROGRESS.SUBJECT = SUBJECT.SUBJECT
								INNER JOIN
								PULPIT
								ON SUBJECT.PULPIT = PULPIT.PULPIT
								INNER JOIN
								FACULTY
								ON PULPIT.FACULTY = FACULTY.FACULTY
								INNER JOIN 
								PROFESSION
								ON FACULTY.FACULTY = PROFESSION.FACULTY
								ORDER BY	FACULTY.FACULTY, 
											PULPIT.PULPIT, 
											PROFESSION.PROFESSION, 
											STUDENT.NAME ASC, 
											PROGRESS.NOTE DESC;*/

SELECT FACULTY.FACULTY_NAME [���������], PULPIT.PULPIT_NAME [�������],
		PROFESSION.PROFESSION_NAME [�������������], PROGRESS.SUBJECT [����������],
		STUDENT.NAME [��� ��������], PROGRESS.NOTE [������], 
		CASE
			WHEN (PROGRESS.NOTE = 6) then '�����'
			WHEN (PROGRESS.NOTE = 7) then '����'
			WHEN (PROGRESS.NOTE = 8) then '������'
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
		WHERE PROGRESS.NOTE BETWEEN 6 AND 8
		ORDER BY	FACULTY.FACULTY,
					PULPIT.PULPIT, 
					PROFESSION.PROFESSION, 
					STUDENT.NAME ASC, 
					PROGRESS.NOTE DESC;
--5
SELECT FACULTY.FACULTY_NAME [���������], PULPIT.PULPIT_NAME [�������],
		PROFESSION.PROFESSION_NAME [�������������], PROGRESS.SUBJECT [����������],
		STUDENT.NAME [��� ��������], PROGRESS.NOTE [������], 
		CASE
			WHEN (PROGRESS.NOTE = 6) then '�����'
			WHEN (PROGRESS.NOTE = 7) then '����'
			WHEN (PROGRESS.NOTE = 8) then '������'
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
		WHERE PROGRESS.NOTE BETWEEN 6 AND 8
		ORDER BY	(CASE
						WHEN (PROGRESS.NOTE = 6) THEN 3
						WHEN (PROGRESS.NOTE = 8) THEN 2
						WHEN (PROGRESS.NOTE = 7) THEN 1
					END
					);
--6
SELECT PULPIT.PULPIT_NAME [�������], ISNULL(TEACHER.TEACHER_NAME, '***') [�������������]
							FROM PULPIT
							LEFT OUTER JOIN TEACHER
							ON PULPIT.PULPIT = TEACHER.PULPIT;
--7
SELECT PULPIT.PULPIT_NAME [�������], ISNULL(TEACHER.TEACHER_NAME, '***') [�������������]
							FROM TEACHER
							LEFT OUTER JOIN PULPIT
							ON PULPIT.PULPIT = TEACHER.PULPIT;
SELECT PULPIT.PULPIT_NAME [�������], ISNULL(TEACHER.TEACHER_NAME, '***') [�������������]
							FROM PULPIT
							RIGHT OUTER JOIN TEACHER
							ON PULPIT.PULPIT = TEACHER.PULPIT;
--8
CREATE DATABASE TEST;
USE TEST;
CREATE TABLE T1
(
	T1F1 NVARCHAR(50),
	T1F2 INT
);
CREATE TABLE T2
(
	T2F1 NVARCHAR(50),
	T2F2 INT
);
INSERT INTO T1
	VALUES ('111', 111),
			('222', 222),
			('333', 333),
			('444', 444),
			('555', 555);
INSERT INTO T2
	VALUES ('111', 111),
			('222', 22),
			('333', 33),
			('44', 444),
			('555', 55);
SELECT *	FROM T1
			FULL OUTER JOIN T2
			ON T1F1 = T2F1;
SELECT *	FROM T2
			FULL OUTER JOIN T1
			ON T1F1 = T2F1;
SELECT *	FROM T1
			FULL OUTER JOIN T2
			ON T1F2 = T2F2;
SELECT *	FROM T1
			LEFT OUTER JOIN T2
			ON T1F2 = T2F2;
SELECT *	FROM T1
			RIGHT OUTER JOIN T2
			ON T1F2 = T2F2;
SELECT *	FROM T1
			INNER JOIN T2
			ON T1F2 = T2F2;
--8.3 QU
SELECT ISNULL(T1F1, '***'), ISNULL(T1F2, '***')	
			FROM T1
			FULL OUTER JOIN T2
			ON T1F2 = T2F2;
SELECT ISNULL(T1F1, '***'), T2F2	
			FROM T1
			FULL OUTER JOIN T2
			ON T1F2 = T2F2;
SELECT *	
			FROM T1
			FULL OUTER JOIN T2
			ON T1F2 = T2F2;
--9
USE Stash_UNIVER;
SELECT AUDITORIUM.AUDITORIUM, AUDITORIUM_TYPE.AUDITORIUM_TYPENAME	
								FROM AUDITORIUM
								CROSS JOIN
								AUDITORIUM_TYPE
								WHERE AUDITORIUM.AUDITORIUM_TYPE = AUDITORIUM_TYPE.AUDITORIUM_TYPE;

