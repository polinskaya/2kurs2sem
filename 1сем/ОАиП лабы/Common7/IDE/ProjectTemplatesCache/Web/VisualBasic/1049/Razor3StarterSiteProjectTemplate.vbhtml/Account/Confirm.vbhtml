@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Страница подтверждения регистрации"

    Dim message As String = ""
    Dim confirmationToken As String = Request("confirmationCode")

    WebSecurity.Logout()
    If Not confirmationToken.IsEmpty() Then
        If WebSecurity.ConfirmAccount(confirmationToken) Then
            message = "Регистрация завершена! Чтобы войти на сайт, щелкните вкладку ""Вход""."
        Else
            message = "Не удалось подтвердить данные регистрации."
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Используйте следующую форму для подтверждения учетной записи.</h2>
</hgroup>

@If Not message.IsEmpty() Then
    @<p>@message</p>
Else
    @<form method="post">
        <fieldset>
            <legend>Код подтверждения</legend>
            <ol>
                <li>
                    <label for="confirmationCode">Код подтверждения</label>
                    <input type="text" id="confirmationCode" name="confirmationCode" />
                </li>
            </ol>
            <input type="submit" value="Подтвердить" />
        </fieldset>
    </form>
End If