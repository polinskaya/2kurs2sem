Imports System.ServiceModel

' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя интерфейса "$safeitemrootname$" в коде и файле конфигурации.
<ServiceContract()> _
Public Interface $safeitemrootname$

    <OperationContract()> _
    Function GetData(ByVal value As Integer) As String

End Interface
