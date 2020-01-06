' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя интерфейса "IService1" в коде и файле конфигурации.
<ServiceContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Interface IService1

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function GetData(ByVal value As Integer) As String

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function GetDataUsingDataContract(ByVal composite As CompositeType) As CompositeType

    ' TODO: Добавьте здесь операции служб

End Interface

' Используйте контракт данных, как показано в примере ниже, чтобы добавить составные типы к операциям служб.
$if$ ($targetframeworkversion$ <= 3.5)
<DataContract()> _
Public Class CompositeType

    Private boolValueField As Boolean
    Private stringValueField As String

    <DataMember()> _
    Public Property BoolValue() As Boolean
        Get
            Return Me.boolValueField
        End Get
        Set(ByVal value As Boolean)
            Me.boolValueField = value
        End Set
    End Property

    <DataMember()> _
    Public Property StringValue() As String
        Get
            Return Me.stringValueField
        End Get
        Set(ByVal value As String)
            Me.stringValueField = value
        End Set
    End Property
$else$
<DataContract()>
Public Class CompositeType

    <DataMember()>
    Public Property BoolValue() As Boolean

    <DataMember()>
    Public Property StringValue() As String
$endif$
End Class
