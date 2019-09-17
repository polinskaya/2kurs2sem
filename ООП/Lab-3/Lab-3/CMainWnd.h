#pragma once
#include "resource.h"
#include "CMatrix.h"
#include "Lib.h"
#include "CPlot2D.h"

CMatrix SpaceToWindow(CRectD& RS, CRect& RW)// ¬озвращает матрицу пересчета координат из мировых в оконные
{
	CMatrix M(3, 3);
	CSize sz = RW.Size();          // –азмер области в ќ Ќ≈
	int dwx = sz.cx;               // Ўирина
	int dwy = sz.cy;               // ¬ысота
	CSizeD szd = RS.SizeD();       // –азмер области в ћ»–ќ¬џ’ координатах

	double dsx = szd.cx;           // Ўирина в мировых координатах
	double dsy = szd.cy;           // ¬ысота в мировых координатах

	double kx = (double)dwx / dsx; // ћасштаб по x
	double ky = (double)dwy / dsy; // масштаб по y

	M(0, 0) = kx; M(0, 1) = 0;   M(0, 2) = (double)RW.left - kx*RS.left;
	M(1, 0) = 0;  M(1, 1) = -ky; M(1, 2) = (double)RW.bottom + ky*RS.bottom;
	M(2, 0) = 0;  M(2, 1) = 0;   M(2, 2) = 1;

	return M;
}
void SetMyMode(CDC& dc, CRectD& RS, CRect& RW)// ”станавливает режим отображени€ MM_ANISOTROPIC и его параметры
{
	double dsx = RS.right - RS.left;
	double dsy = RS.top - RS.bottom;
	double xsL = RS.left;
	double ysL = RS.bottom;

	int dwx = RW.right - RW.left;
	int dwy = RW.bottom - RW.top;
	int xwL = RW.left;
	int ywL = RW.bottom;

	dc.SetMapMode(MM_ANISOTROPIC);       // ”становка режима отображени€
	dc.SetWindowExt((int)dsx, (int)dsy); // »змененение ориентации и масштаба
	dc.SetViewportExt(dwx, -dwy);
	dc.SetWindowOrg((int)xsL, (int)ysL); // ”становка смещени€
	dc.SetViewportOrg(xwL, ywL);
}


class CMainWnd : public CFrameWnd
{
private:
	CMatrix X, Y;
	CRect RW; //созд объект CRect 2-D rectangle, similar to Windows RECT structure.
	CRectD RS;
	CPlot2D Graph, Graphs[4];
	CMyPen PenLine, PenAxis;
	enum { menu_F1, menu_F2, menu_F3, menu_F4, menu_F1234, clear } condition;
	CMenu menu;
	DECLARE_MESSAGE_MAP()
	int OnCreate(LPCREATESTRUCT);

public:
	CMainWnd::CMainWnd() {
		Create(NULL, L"Laboratory 3", WS_OVERLAPPEDWINDOW, CRect(300, 300, 1500, 900), NULL, NULL);
		condition = clear;
	}

	void OnPaint();

	void Menu_F1();
	void Menu_F2();
	void Menu_F3();
	void Menu_F4();
	void Menu_F1234();
	void Func1();
	void Func2();
	void Func3();
	void Func4();

	double MyF1(double);
	double MyF2(double);
	double MyF3(double);
	double MyF4(double);

	void Clear();
	void Exit();
};

BEGIN_MESSAGE_MAP(CMainWnd, CFrameWnd)
	ON_WM_CREATE()
	ON_WM_PAINT()
	ON_COMMAND(ID_TESTS_F1, Menu_F1)
	ON_COMMAND(ID_TESTS_F2, Menu_F2)
	ON_COMMAND(ID_TESTS_F3, Menu_F3)
	ON_COMMAND(ID_TESTS_F4, Menu_F4)
	ON_COMMAND(ID_TESTS_F1234, Menu_F1234)
	ON_COMMAND(ID_CLEAR, Clear)
	ON_COMMAND(ID_EXIT, Exit)
	ON_WM_PAINT()
END_MESSAGE_MAP()

int CMainWnd::OnCreate(LPCREATESTRUCT lpCreateStruct)
{
	if (CFrameWnd::OnCreate(lpCreateStruct) == -1)
		return -1;
	menu.LoadMenu(IDR_MENU1); // «агрузить меню из файла ресурса
	SetMenu(&menu); // ”становить меню
	return 0;
}


void CMainWnd::OnPaint()
{
	CPaintDC dc(this);
	switch (condition)
	{
	case menu_F1: {
		Graph.Draw(dc, 1, 1);
	} break;
	case menu_F2: {
		Graph.GetRS(RS);
		SetMyMode(dc, RS, RW); // ”станавливаем режим отображени€ MM_ANISOTROPIC
		Graph.Draw1(dc, 1, 1);
		dc.SetMapMode(MM_TEXT); // ”станавливаем режим отображени€ MM_TEXT
	} break;
	case menu_F3: {
		Graph.Draw(dc, 1, 1);
	} break;
	case menu_F4: {
		Graph.GetRS(RS);
		SetMyMode(dc, RS, RW);
		Graph.Draw1(dc, 1, 1);
		dc.SetMapMode(MM_TEXT);
	} break;
	case menu_F1234: {
		Func1();
		Graphs[0].Draw(dc, 1, 1);
		dc.SetMapMode(MM_TEXT);

		Func3();
		Graphs[2].Draw(dc, 1, 1);
		dc.SetMapMode(MM_TEXT);

		Func2();
		Graphs[1].Draw(dc, 1, 1);
		dc.SetMapMode(MM_TEXT);

		Func4();
		Graphs[3].Draw(dc, 1, 1);
		dc.SetMapMode(MM_TEXT);
	} break;
	case clear: {
		Invalidate();
	} break;
	}
}

void CMainWnd::Menu_F1()
{
	double dx = pi / 36; //шаг изменени€ аргумента
	double xL = -3 * pi;  // интервал [-3 * pi, 3 * pi]
	double xH = -xL;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);// »змен€ет размер матрицы с уничтожением данных
	Y.RedimMatrix(N + 1);

	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF1(X(i));
	}
	PenLine.Set(PS_SOLID, 1, RGB(255, 0, 0));// PS_SOLID-сплошной, толщина-1 ,красный цвет(цвет графика)
	PenAxis.Set(PS_SOLID, 1, RGB(0, 0, 255));//PS_SOLID-сплошной, толщина Ц2, синий цвет(координатна€ ось) 
	RW.SetRect(150, 50, 600, 450);
	Graph.SetParams(X, Y, RW);
	Graph.SetPenLine(PenLine);
	Graph.SetPenAxis(PenAxis);

	condition = menu_F1;
	this->Invalidate();
}
void CMainWnd::Menu_F2()
{
	double dx = 0.025; //с шаг изменени€ аргумента  
	double xL = -5; // интервал[-5]
	double xH = -xL;
	int N = (xH - xL) / dx; 
	X.RedimMatrix(N + 1); //»змен€ет размер матрицы с уничтожением данных
	Y.RedimMatrix(N + 1);

	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF2(X(i));
	}
	PenLine.Set(PS_SOLID, 0, RGB(0, 255, 0));//толщина Ц1, цвет Ц зеленый, тип линии Ц сплошна€
	PenAxis.Set(PS_SOLID, 0, RGB(0, 0, 255));//толщина Ц2, цвет Ц синий
	RW.SetRect(150, 50, 600, 450);
	Graph.SetParams(X, Y, RW);
	Graph.SetPenLine(PenLine);
	Graph.SetPenAxis(PenAxis);

	condition = menu_F2;
	this->Invalidate();
}
void CMainWnd::Menu_F3()
{
	double dx = pi / 36;
	double xL = 0;
	double xH = 6 * pi;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);

	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF3(X(i));
	}
	PenLine.Set(PS_DASHDOT, 1, RGB(255, 0, 0));//толщина Ц3, цвет Ц красный, тип линии Ц штрих - пунктирна€
	PenAxis.Set(PS_SOLID, 2, RGB(0, 0, 0));//толщина Ц2, цвет Ц черный
	RW.SetRect(150, 50, 600, 450);
	Graph.SetParams(X, Y, RW);
	Graph.SetPenLine(PenLine);
	Graph.SetPenAxis(PenAxis);

	condition = menu_F3;
	this->Invalidate();
}
void CMainWnd::Menu_F4()
{
	double dx = 0.25;
	double xL = -10;
	double xH = -xL;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);

	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF4(X(i));
	}
	PenLine.Set(PS_SOLID, 1, RGB(255, 0, 0));//
	PenAxis.Set(PS_SOLID, 1, RGB(0, 0, 255));//толщина Ц2, цвет Ц синий
	RW.SetRect(150, 50, 600, 450);
	Graph.SetParams(X, Y, RW);
	Graph.SetPenLine(PenLine);
	Graph.SetPenAxis(PenAxis);

	condition = menu_F4;
	this->Invalidate();
}
void CMainWnd::Menu_F1234()
{
	condition = menu_F1234;
	this->Invalidate();
}
void CMainWnd::Func1()
{
	double dx = pi / 36;
	double xL = -3 * pi;
	double xH = -xL;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);
	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF1(X(i));
	}
	PenLine.Set(PS_SOLID, 1, RGB(255, 0, 0));
	PenAxis.Set(PS_SOLID, 2, RGB(0, 0, 255));
	RW.SetRect(50, 50, 300, 200);
	Graphs[0].SetParams(X, Y, RW);
	Graphs[0].SetPenLine(PenLine);
	Graphs[0].SetPenAxis(PenAxis);
}
void CMainWnd::Func2()
{
	double dx = 0.25;
	double xL = -5;
	double xH = -xL;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);
	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF2(X(i));
	}
	PenLine.Set(PS_SOLID, 0, RGB(0, 255, 0));
	PenAxis.Set(PS_SOLID, 0, RGB(0, 0, 255));
	RW.SetRect(450, 50, 700, 200);
	Graphs[1].SetParams(X, Y, RW);
	Graphs[1].SetPenLine(PenLine);
	Graphs[1].SetPenAxis(PenAxis);
}
void CMainWnd::Func3()
{
	double dx = pi / 36;
	double xL = 0;
	double xH = 6 * pi;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);
	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF3(X(i));
	}
	PenLine.Set(PS_DOT, 3, RGB(255, 0, 0));
	PenAxis.Set(PS_SOLID, 3, RGB(0, 0, 0));
	RW.SetRect(50, 300, 300, 450);
	Graphs[2].SetParams(X, Y, RW);
	Graphs[2].SetPenLine(PenLine);
	Graphs[2].SetPenAxis(PenAxis);
}
void CMainWnd::Func4()
{
	double dx = 0.25;
	double xL = -10;
	double xH = -xL;
	int N = (xH - xL) / dx;
	X.RedimMatrix(N + 1);
	Y.RedimMatrix(N + 1);
	for (int i = 0; i <= N; i++) {
		X(i) = xL + i*dx;
		Y(i) = MyF4(X(i));
	}
	PenLine.Set(PS_SOLID, 2, RGB(255, 0, 0));
	PenAxis.Set(PS_SOLID, 2, RGB(0, 0, 255));
	RW.SetRect(450, 300, 700, 450);
	Graphs[3].SetParams(X, Y, RW);
	Graphs[3].SetPenLine(PenLine);
	Graphs[3].SetPenAxis(PenAxis);
}

double CMainWnd::MyF1(double x) //услови€ дл€ наших функций
{
	return sin(x) / x;
}
double CMainWnd::MyF2(double x)
{
	return x*x*x;
}
double CMainWnd::MyF3(double x)
{
	return sqrt(x)*sin(x);
}
double CMainWnd::MyF4(double x)
{
	return x*x;
}

void CMainWnd::Clear()
{
	condition = clear;
	RedrawWindow();
}
void CMainWnd::Exit()
{
	DestroyWindow();
}