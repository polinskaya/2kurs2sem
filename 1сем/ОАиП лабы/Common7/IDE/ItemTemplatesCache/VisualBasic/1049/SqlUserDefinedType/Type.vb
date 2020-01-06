Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server

<Serializable()> _
<Microsoft.SqlServer.Server.SqlUserDefinedType(Format.Native)> _
Public Structure $safeitemname$
    Implements INullable

    Public Overrides Function ToString() As String
        ' Поместите здесь свой код
        Return ""
    End Function

    Public ReadOnly Property IsNull() As Boolean Implements INullable.IsNull
        Get
            ' Поместите здесь свой код
            Return m_Null
        End Get
    End Property

    Public Shared ReadOnly Property Null As $safeitemname$
        Get
            Dim h As $safeitemname$ = New $safeitemname$
            h.m_Null = True
            Return h
        End Get
    End Property

    Public Shared Function Parse(ByVal s As SqlString) As $safeitemname$
        If s.IsNull Then
            Return Null
        End If

        Dim u As $safeitemname$ = New $safeitemname$
        ' Поместите здесь свой код
        Return u
    End Function

    ' Это местозаполнитель метода
    Public Function Method1() As String
        ' Поместите здесь свой код
        Return "$IT_UDT_VB_Loc_1$"
    End Function

    ' Это местозаполнитель статического метода
    Public Shared Function Method2() As SqlString
        ' Поместите здесь свой код
        Return New SqlString("$IT_UDT_VB_Loc_1$")
    End Function

    ' Это местозаполнитель члена поля
    Public m_var1 As Integer
    ' Частный член
    Private m_Null As Boolean
End Structure

