Imports System.Web.DynamicData

Partial Class _Default
    Inherits System.Web.UI.Page

        
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Dim visibleTables As System.Collections.IList = MetaModel.Default.VisibleTables
        If (visibleTables.Count = 0) Then
            Throw New InvalidOperationException("Нет ни одной доступной таблицы. Убедитесь, что по крайней мере одна модель данных зарегистрирована в Global.asax,"& _ 
                "технология формирования шаблонов включена или реализованы настраиваемые страницы.")
        End If
        Menu1.DataSource = visibleTables
        Menu1.DataBind
    End Sub


End Class
