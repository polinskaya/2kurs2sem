<ComClass($safeitemname$.ClassId, $safeitemname$.InterfaceId, $safeitemname$.EventsId)> _
Public Class $safeitemname$

#Region "Идентификаторы COM GUID"
    ' Данные GUID обеспечивают идентификацию COM для данного класса 
    ' и его COM-интерфейсов. При их изменении существующие 
    ' клиенты потеряют доступ к классу.
    Public Const ClassId As String = "$guid1$"
    Public Const InterfaceId As String = "$guid2$"
    Public Const EventsId As String = "$guid3$"
#End Region

    ' В классе COM, для которого разрешено создание, должна присутствовать процедура Public Sub New() 
    ' без параметров, иначе класс не будет 
    ' зарегистрирован в реестре COM и его будет невозможно создать 
    ' посредством CreateObject.
    Public Sub New()
        MyBase.New()
    End Sub

End Class


