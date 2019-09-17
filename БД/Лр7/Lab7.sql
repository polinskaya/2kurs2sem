---1--- 

SELECT F.FACULTY, P.PULPIT_NAME, PR.PROFESSION_NAME
FROM  FACULTY AS F, PULPIT AS P, PROFESSION AS PR
WHERE  F.FACULTY=P.FACULTY AND P.FACULTY=PR.FACULTY AND  PR.PROFESSION_NAME IN
	(SELECT PROFESSION_NAME FROM PROFESSION WHERE PROFESSION_NAME LIKE '%���������%')


---2---

SELECT	F.FACULTY,	P.PULPIT_NAME, PR.PROFESSION_NAME
FROM	FACULTY AS F INNER JOIN PULPIT AS P ON F.FACULTY=P.FACULTY INNER JOIN PROFESSION AS PR ON P.FACULTY=PR.FACULTY
WHERE	PR.PROFESSION_NAME IN 
	(SELECT PROFESSION_NAME FROM PROFESSION WHERE PROFESSION_NAME LIKE '%���������%')


---3---

SELECT  DISTINCT F.FACULTY AS [���������],
	P.PULPIT_NAME AS [�������]	,
	PR.PROFESSION_NAME AS [���������]
FROM	 FACULTY AS F INNER JOIN PROFESSION AS PR ON PR.FACULTY=F.FACULTY INNER JOIN PULPIT AS P ON F.FACULTY=P.FACULTY	
WHERE	 PROFESSION_NAME LIKE '%���������%'


---4---

SELECT  	A1.AUDITORIUM_NAME AS [����� ���������], 
	A1.AUDITORIUM_CAPACITY AS [�����������],
	A1.AUDITORIUM_TYPE AS [��� ���������]
FROM AUDITORIUM A1 

SELECT 
	A1.AUDITORIUM_TYPE AS [��� ���������],
	A1.AUDITORIUM_CAPACITY AS [������������ ����������� ��� ����],
	A1.AUDITORIUM_NAME AS [������ ��������� ����� �����������] 
FROM AUDITORIUM A1 
WHERE AUDITORIUM_CAPACITY = (SELECT TOP(1) AUDITORIUM_CAPACITY FROM AUDITORIUM A2 
WHERE A1.AUDITORIUM_TYPE=A2.AUDITORIUM_TYPE ORDER BY AUDITORIUM_CAPACITY DESC)

---5---

SELECT FACULTY_NAME  AS [������ �����������, �� ������� ��� �� ����� �������] FROM FACULTY
WHERE NOT EXISTS 
(SELECT * FROM PULPIT WHERE FACULTY.FACULTY=PULPIT.FACULTY)

---6---

SELECT top 1 
(SELECT AVG(NOTE) FROM PROGRESS WHERE SUBJECTS='����') [����],
(SELECT AVG(NOTE) FROM PROGRESS WHERE SUBJECTS='����')[����],
(SELECT AVG(NOTE) FROM PROGRESS WHERE SUBJECTS='��')[��]

---7---

-- ������� ���������, � ������� ����� ������ ������ �� ��������
SELECT P1.IDSTUDENT AS [�������], P1.NOTE AS [������], P1.SUBJECTS AS [�������]
FROM PROGRESS AS P1 
WHERE NOTE>=ALL(SELECT NOTE FROM PROGRESS AS P2 WHERE P1.SUBJECTS=P2.SUBJECTS)

---8---

-- ������� ���������, � ������� ������ �� �������� ����, ��� � ���� ����
SELECT P1.IDSTUDENT AS [�������], P1.NOTE AS [������], P1.SUBJECTS AS [�������]
FROM PROGRESS AS P1 
WHERE NOTE>ANY(SELECT NOTE FROM PROGRESS AS P2 WHERE P1.SUBJECTS=P2.SUBJECTS)
