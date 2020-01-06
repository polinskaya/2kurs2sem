Imports System.ServiceModel
Imports System.ServiceModel.Activation
Imports System.ServiceModel.Web

<ServiceContract(Namespace:="")>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<AspNetCompatibilityRequirements(RequirementsMode:=AspNetCompatibilityRequirementsMode.Allowed)>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Class $safeitemrootname$

    ' Чтобы использовать протокол HTTP GET, добавьте атрибут <WebGet()>. (По умолчанию ResponseFormat имеет значение WebMessageFormat.Json.)
    ' Чтобы создать операцию, возвращающую XML,
    '     добавьте <WebGet(ResponseFormat:=WebMessageFormat.Xml)>,
    '     и включите следующую строку в текст операции:
    '         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml"
    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Public Sub DoWork()
        ' Добавьте здесь реализацию операции
    End Sub

    ' Добавьте здесь дополнительные операции и отметьте их атрибутом <OperationContract()>

End Class
