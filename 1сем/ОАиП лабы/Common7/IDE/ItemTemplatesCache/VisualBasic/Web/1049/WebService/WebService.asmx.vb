Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel

$if$ ($targetframeworkversion$ >= 3.5)' Чтобы разрешить вызывать веб-службу из скрипта с помощью ASP.NET AJAX, раскомментируйте следующую строку.
' <System.Web.Script.Services.ScriptService()> _
$endif$<System.Web.Services.WebService(Namespace:="http://tempuri.org/")> _
<System.Web.Services.WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<ToolboxItem(False)> _
Public Class $classname$
    Inherits System.Web.Services.WebService

    <WebMethod()> _
    Public Function HelloWorld() As String
       Return "Привет всем!"
    End Function

End Class