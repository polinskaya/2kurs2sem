' Выполните шаги 1a или 1b, а затем 2, чтобы использовать этот пользовательский элемент управления в файле XAML.
'
' Шаг 1a. Использование пользовательского элемента управления в файле XAML, существующем в текущем проекте.
' Добавьте атрибут XmlNamespace в корневой элемент файла разметки, где он 
' будет использоваться:
'
'     xmlns:MyNamespace="clr-namespace:$rootnamespace$"
'
'
' Шаг 1б. Использование пользовательского элемента управления в файле XAML, существующем в другом проекте.
' Добавьте атрибут XmlNamespace в корневой элемент файла разметки, где он 
' будет использоваться:
'
'     xmlns:MyNamespace="clr-namespace:$rootnamespace$;assembly=$rootnamespace$"
'
' Потребуется также добавить ссылку из проекта, в котором находится файл XAML,
' на данный проект и заново выполнить построение во избежание ошибок компиляции:
'
'     Щелкните правой кнопкой мыши нужный проект в обозревателе решений и выберите
'     "Добавить ссылку"->"Проекты"->[Поиск и выбор проекта]
'
'
' Шаг 2)
' Теперь можно использовать элемент управления в файле XAML. Внимание! Технология Intellisense
' в редакторе XML пока не поддерживает пользовательские элементы управления и их дочерние элементы.
'
'     <MyNamespace:$safeitemrootname$/>
'

Imports System.Windows.Controls.Primitives


Public Class $safeitemrootname$
    Inherits System.Windows.Controls.Control

    Shared Sub New()
        'Вызов OverrideMetadata сообщает системе, что этот элемент содержит стиль, отличающийся от стиля в базовом классе.
        'Стиль определен в файле themes\generic.xaml
        DefaultStyleKeyProperty.OverrideMetadata(GetType($safeitemrootname$), new FrameworkPropertyMetadata(GetType($safeitemrootname$)))
    End Sub

End Class
