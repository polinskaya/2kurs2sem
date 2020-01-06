Imports System.Activities

Public NotInheritable Class $safeitemname$
    Inherits CodeActivity
    
    'Определите входной аргумент действия типа String
    Property Text() As InArgument(Of String)

    ' Если действие возвращает значение, создайте класс, производный от CodeActivity(Of TResult),
    ' и верните значение из метода Execute.
    Protected Overrides Sub Execute(ByVal context As CodeActivityContext)
        'Получите значение входного аргумента Text во время выполнения
        Dim text As String
        text = context.GetValue(Me.Text)
    End Sub
End Class
