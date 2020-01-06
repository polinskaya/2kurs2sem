Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

$if$ ($targetframeworkversion$ >= 3.5)' Чтобы разрешить вызывать веб-службу из скрипта с помощью ASP.NET AJAX, раскомментируйте следующую строку.
' <System.Web.Script.Services.ScriptService()> _
$endif$<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class $codebehindclassname$
     Inherits System.Web.Services.WebService

    <WebMethod()> _
    Public Function HelloWorld() As String
        Return "Привет всем!"
    End Function

End Class