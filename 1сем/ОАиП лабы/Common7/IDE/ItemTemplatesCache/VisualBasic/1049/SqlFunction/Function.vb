Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server

Partial Public Class UserDefinedFunctions
    <Microsoft.SqlServer.Server.SqlFunction()> _
    Public Shared Function $safeitemname$() As SqlString
        ' Добавьте здесь свой код
        Return New SqlString("$IT_FUNC_VB_Loc_1$")
    End Function
End Class
