Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server


<Serializable()> _
<Microsoft.SqlServer.Server.SqlUserDefinedAggregate(Format.Native)> _
Public Structure $safeitemname$

    Public Sub Init()
        ' Поместите здесь свой код
    End Sub

    Public Sub Accumulate(ByVal value As SqlString)
        ' Поместите здесь свой код
    End Sub

    Public Sub Merge(ByVal value as $safeitemname$)
        ' Поместите здесь свой код
    End Sub

    Public Function Terminate() As SqlString
        ' Поместите здесь свой код
        Return New SqlString("")
    End Function

    ' Это местозаполнитель члена поля
    Private var1 As Integer

End Structure

