Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server


Partial Public Class Triggers
    ' Введите существующую таблицу или представление для конечного объекта и раскомментируйте строку атрибута
    ' <Microsoft.SqlServer.Server.SqlTrigger(Name:="$safeitemname$", Target:="Table1", Event:="FOR UPDATE")> _
    Public Shared Sub  $safeitemname$ ()
        ' Замените собственным кодом
        SqlContext.Pipe.Send("Trigger FIRED")
    End Sub
End Class
