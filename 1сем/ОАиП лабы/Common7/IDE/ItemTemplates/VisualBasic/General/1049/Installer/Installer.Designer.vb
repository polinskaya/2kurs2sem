<System.ComponentModel.RunInstaller(True)> Partial Class $safeitemrootname$
    Inherits System.Configuration.Install.Installer

    'Установщик переопределяет метод dispose для очистки списка компонентов.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Является обязательной для конструктора компонентов
    Private components As System.ComponentModel.IContainer

    'Примечание: следующая процедура является обязательной для конструктора компонентов
    'Для ее изменения используйте конструктор компонентов.  
    'Не изменяйте ее в редакторе исходного кода.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        components = New System.ComponentModel.Container()
    End Sub

End Class
