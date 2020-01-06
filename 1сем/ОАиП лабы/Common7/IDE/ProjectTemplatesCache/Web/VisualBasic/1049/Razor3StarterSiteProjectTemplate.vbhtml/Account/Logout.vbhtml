@Code
    WebSecurity.RequireAuthenticatedUser()

    If IsPost Then
        ' Проверка того, что запрос отправлен пользователем
        AntiForgery.Validate()

        ' Выход из контекста текущего пользователя
        WebSecurity.Logout()

        ' Возврат на домашнюю страницу или URL-адрес возврата
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        Context.RedirectLocal(returnUrl)
    Else
        Response.Redirect("~/")
    End If
End Code