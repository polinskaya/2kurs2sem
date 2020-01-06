 Partial Public Class $safeitemrootname$
    Inherits Application

    public Sub New()
        InitializeComponent()
    End Sub

    Private Sub Application_Startup(ByVal o As Object, ByVal e As StartupEventArgs) Handles Me.Startup
        ' Задайте здесь начальную страницу
    End Sub
    
    Private Sub Application_Exit(ByVal o As Object, ByVal e As EventArgs) Handles Me.Exit

    End Sub
    
    Private Sub Application_UnhandledException(ByVal sender As object, ByVal e As ApplicationUnhandledExceptionEventArgs) Handles Me.UnhandledException

        ' Если приложение выполняется вне отладчика, воспользуйтесь для сообщения об исключении
        ' механизмом исключений браузера. В IE исключение будет отображаться в виде желтого значка оповещения 
        ' в строке состояния, а в Firefox - в виде ошибки скрипта.
        If Not System.Diagnostics.Debugger.IsAttached Then

            ' ПРИМЕЧАНИЕ. Это позволит приложению выполняться после того, как исключение было выдано,
            ' но не было обработано. 
            ' Для рабочих приложений такую обработку ошибок следует заменить на код, 
            ' оповещающий веб-сайт об ошибке и останавливающий работу приложения.
            e.Handled = True
            Deployment.Current.Dispatcher.BeginInvoke(New Action(Of ApplicationUnhandledExceptionEventArgs)(AddressOf ReportErrorToDOM), e)
        End If
    End Sub

   Private Sub ReportErrorToDOM(ByVal e As ApplicationUnhandledExceptionEventArgs)

        Try
            Dim errorMsg As String = e.ExceptionObject.Message + e.ExceptionObject.StackTrace
            errorMsg = errorMsg.Replace(""""c, "'"c).Replace(ChrW(13) & ChrW(10), "\n")

            System.Windows.Browser.HtmlPage.Window.Eval("throw new Error(""Unhandled Error in Silverlight 2 Application " + errorMsg + """);")
        Catch
        
        End Try
    End Sub
    
End Class
