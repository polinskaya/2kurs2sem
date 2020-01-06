' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя интерфейса "IWorkflow1" в коде и файле конфигурации.
<ServiceContract()> _
Public Interface IWorkflow1

    <OperationContract()> _
    Function GetData(ByVal value As Integer) As String

    ' TODO: Добавьте здесь операции служб

End Interface
