Public Class $safeitemrootname$
    Inherits StateMachineWorkflowActivity

    ' Эти переменные связаны со входными и выходными параметрами ReceiveActivity.
    Private returnValueField As String
    Private inputValueField As Integer

    Public Property InputValue() As Integer
        Get
            Return Me.inputValueField
        End Get
        Set(ByVal value As Integer)
            Me.inputValueField = value
        End Set
    End Property

    Public Property ReturnValue() As String
        Get
            Return Me.returnValueField
        End Get
        Set(ByVal value As String)
            Me.returnValueField = value
        End Set
    End Property
End Class
