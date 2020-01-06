Partial Public Class App
    Inherits Application

    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub Application_Startup(ByVal o As Object, ByVal e As StartupEventArgs) Handles Me.Startup
        Me.RootVisual = New MainPage()
    End Sub

    Private Sub Application_UnhandledException(ByVal sender As Object, ByVal e As ApplicationUnhandledExceptionEventArgs) Handles Me.UnhandledException

        ' Если приложение выполняется вне отладчика, воспользуйтесь для сообщения об исключении
        ' механизмом исключений браузера. В IE исключение будет отображаться в виде желтого значка оповещения 
        ' в строке состояния, а в Firefox - в виде ошибки скрипта.
        If Not System.Diagnostics.Debugger.IsAttached Then

            ' ПРИМЕЧАНИЕ. Это позволит приложению выполняться после того, как исключение было выдано,
            ' но не было обработано. 
            ' Для рабочих приложений такую обработку ошибок следует заменить на код, 
            ' оповещающий веб-сайт об ошибке и останавливающий работу приложения.
            e.Handled = True
            Dim errorWindow As ChildWindow = New ErrorWindow(e.ExceptionObject)
            errorWindow.Show()
        End If
    End Sub

End Class
