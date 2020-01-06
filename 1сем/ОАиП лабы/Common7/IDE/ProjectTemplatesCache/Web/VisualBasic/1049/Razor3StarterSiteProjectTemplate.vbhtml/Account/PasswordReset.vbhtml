@* Удалите этот раздел, если используется объединение *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Сброс пароля"

    Dim passwordResetToken As String = Request.Form("resetToken")

    If passwordResetToken Is Nothing Then
        passwordResetToken = Request.QueryString("resetToken")
    End If

    Dim tokenExpired As Boolean = False
    Dim isSuccess As Boolean = False

    ' Настройка проверки
    Validation.RequireField("newPassword", "Поле нового пароля является обязательным.")
    Validation.Add("confirmPassword",
        Validator.EqualsTo("newPassword", "Новый пароль и его подтверждение не совпадают."))
    Validation.RequireField("passwordResetToken", "Поле маркера сброса пароля является обязательным.")
    Validation.Add("newPassword",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="Новый пароль должен содержать не менее 6 символов"))

    If IsPost AndAlso Validation.IsValid() Then
        AntiForgery.Validate()
        Dim newPassword As String = Request("newPassword")
        Dim confirmPassword As String = Request("confirmPassword")

        If WebSecurity.ResetPassword(passwordResetToken, newPassword) Then
            isSuccess = True
        Else
            ModelState.AddError("passwordResetToken", "Маркер сброса пароля является недопустимым.")
            tokenExpired = True
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Используйте форму ниже для сброса пароля.</h2>
</hgroup>

@If Not WebMail.SmtpServer.IsEmpty() Then
    If Not Validation.IsValid() Then
        @<p class="validation-summary-errors">
            @If tokenExpired Then
                @<text>Маркер сброса пароля неверный или, возможно, истек срок его действия. Перейдите на <a href="~/Account/ForgotPassword">страницу сброса пароля,</a> 
                чтобы создать новый маркер сброса пароля.</text>
            Else
                @<text>Не удается сбросить пароль. Исправьте ошибки и повторите попытку.</text>
            End If
        </p>
    End If

    If isSuccess Then
        @<p class="message-success">
            Пароль изменен! Щелкните <a href="~/Account/Login" title="Выполнить вход">здесь</a> для входа в систему.
        </p>
    End If

    @<form method="post">
        @AntiForgery.GetHtml()
        <fieldset>
            <legend>Форма смены пароля</legend>
            <ol>
                <li class="new-password">
                    <label for="newPassword" @If Not ModelState.IsValidField("newPassword") Then@<text>class="error-label"</text> End If>Новый пароль</label> 
                    <input type="password" id="newPassword" name="newPassword" disabled="@isSuccess" @Validation.For("newPassword") />
                    @Html.ValidationMessage("newPassword")
                </li>
                <li class="confirm-password">
                    <label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>Подтверждение пароля</label> 
                    <input type="password" id="confirmPassword" name="confirmPassword" disabled="@isSuccess" @Validation.For("confirmPassword") />
                    @Html.ValidationMessage("confirmPassword")
                </li>
                <li class="reset-token">
                    <label for="resetToken" @If Not ModelState.IsValidField("resetToken") Then@<text>class="error-label"</text> End If>Маркер сброса пароля</label> 
                    <input type="text" id="resetToken" name="resetToken" value="@passwordResetToken" disabled="@isSuccess" @Validation.For("resetToken") />
                    @Html.ValidationMessage("resetToken")
                </li>
            </ol>
            <input type="submit" value="Сброс пароля" disabled="@isSuccess" />
        </fieldset>
    </form>
Else
    @<p class="message-info">
        Для этого веб-сайта восстановление пароля отменено, поскольку SMTP-сервер 
        не настроен должным образом. Чтобы сбросить пароль, обратитесь к владельцу 
        этого сайта.
    </p>
End If
