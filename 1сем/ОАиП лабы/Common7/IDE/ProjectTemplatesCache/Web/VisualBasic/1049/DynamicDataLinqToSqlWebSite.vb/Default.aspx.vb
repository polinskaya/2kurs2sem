Imports System.Web.DynamicData

Class _Default
    Inherits Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Dim visibleTables As IList = ASP.global_asax.DefaultModel.VisibleTables
        If visibleTables.Count = 0 Then
            Throw New InvalidOperationException("Нет ни одной доступной таблицы. " &
                "Убедитесь, что по крайней мере одна модель данных зарегистрирована в Global.asax, " &
                "а технология формирования шаблонов включена, либо реализуйте настраиваемые страницы.")
        End If
        Menu1.DataSource = visibleTables
        Menu1.DataBind()
    End Sub
    
End Class
