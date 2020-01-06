Public Class CustomControl1
    Inherits Control

    Shared Sub New()
        'Вызов OverrideMetadata сообщает системе, что этот элемент содержит стиль, отличающийся от стиля в базовом классе.
        'Этот стиль определен в файле Themes\Generic.xaml
        DefaultStyleKeyProperty.OverrideMetadata(GetType(CustomControl1), New FrameworkPropertyMetadata(GetType(CustomControl1)))
    End Sub

End Class
