Imports System.Web
Public Class $safeitemrootname$ 
    Implements IHttpModule

    Private WithEvents _context As HttpApplication

    ''' <summary>
    '''  Вам потребуется настроить этот модуль в файле web.config вашего
    '''  веб-сайта и зарегистрировать его с помощью IIS, чтобы затем воспользоваться им.
    '''  Дополнительные сведения см. по ссылке: http://go.microsoft.com/?linkid=8101007
    ''' </summary>
#Region "Члены IHttpModule"

    Public Sub Dispose() Implements IHttpModule.Dispose

        ' Удалите здесь код

    End Sub

    Public Sub Init(ByVal context As HttpApplication) Implements IHttpModule.Init
        _context = context
    End Sub

#End Region

    Public Sub OnLogRequest(ByVal source As Object, ByVal e As EventArgs) Handles _context.LogRequest

        ' Обработка события LogRequest и настраиваемая реализация 
        ' занесения данных

    End Sub
End Class
