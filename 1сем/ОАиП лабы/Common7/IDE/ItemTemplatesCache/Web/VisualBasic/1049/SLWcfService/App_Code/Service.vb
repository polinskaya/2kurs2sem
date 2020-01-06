Imports System.ServiceModel
Imports System.ServiceModel.Activation

<ServiceContract(Namespace:="")>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<AspNetCompatibilityRequirements(RequirementsMode:=AspNetCompatibilityRequirementsMode.Allowed)>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Class $safeitemrootname$

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Public Sub DoWork()
        ' Добавьте здесь реализацию операции
    End Sub

    ' Добавьте здесь дополнительные операции и отметьте их атрибутом <OperationContract()>

End Class
