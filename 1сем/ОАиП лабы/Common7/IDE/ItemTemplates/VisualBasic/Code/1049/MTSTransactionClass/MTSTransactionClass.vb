' $safeitemname$
Imports System.EnterpriseServices
Imports System

' Атрибут Transaction включает для класса поддержку транзакций.  Класс может установить следующие типы транзакций 
' для объекта:
' 
' Required
' Required New
' Supported
' Not Supported
' Disabled

<Transaction(TransactionOption.Supported)> _
Public Class $safeitemname$
    Inherits ServicedComponent

    ' Реализуйте здесь методы класса.
    '
    ' Транзакционные компоненты используют объект ContextUtil для оповещения вызывающего компонента
    ' об успехе или сбое транзакции.  Если транзакция может завершиться успешно, метод должен установить
    ' ContextUtil.SetComplete.  Если транзакция не может завершиться успешно, метод должен установить
    ' ContextUtil.SetAbort.
    '
    ' Public Sub MySub()
    '    Try
    '        ' Поместите здесь код работы с транзакциями.
    '        ' Ошибки не обнаружены.  Укажите, что транзакция может завершиться, при помощи SetComplete
    '        ContextUtil.SetComplete()
    '    Catch ex As Exception
    '        ' Произошло исключение при обработке транзакции.  
    '        ' Транзакция не может завершиться и вызывает SetAbort.
    '        contextutil.SetAbort()
    '    End Try
    ' End Sub

    ' Вместо явной установки состояния ContextUtil методы в транзакционном классе могут принимать 
    ' атрибут AutoComplete.  При корректном выходе из метода будет вызван SetComplete.
    ' Если в методе произойдет исключение, будет вызван SetAbort.
    ' 
    ' <AutoComplete()> Public Sub MyMethod()
    ' End Sub

End Class
