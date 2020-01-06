Imports System.Web
Public Class $safeitemrootname$
    Implements IHttpHandler

    ''' <summary>
    '''  Вам потребуется настроить этот обработчик в файле web.config вашего 
    '''  веб-сайта и зарегистрировать его с помощью IIS, чтобы затем воспользоваться им.
    '''  Дополнительные сведения см. по ссылке: http://go.microsoft.com/?linkid=8101007
    ''' </summary>
#Region "Члены IHttpHandler"

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            ' Верните значение false в том случае, если ваш управляемый обработчик не может быть повторно использован для другого запроса.
            ' Обычно значение false соответствует случаю, когда некоторые данные о состоянии сохранены по запросу.
            Return True
        End Get
    End Property

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        ' Разместите здесь свою реализацию обработчика.

    End Sub

#End Region

End Class
