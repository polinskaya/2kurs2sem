@* Удалите этот раздел, если используется объединение *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Забыли свой пароль"

    Dim passwordSent As Boolean = False
    Dim resetToken As String = ""
    Dim email As String = Request.Form("email")

    If email Is Nothing Then
        email = Request.QueryString("email")
    End If

    ' Настройка проверки
    Validation.RequireField("email", "Поле адреса электронной почты является обязательным.")

    If IsPost Then
        AntiForgery.Validate()
        ' проверить адрес электронной почты
        Dim isValid As Boolean = True
        If Validation.IsValid() Then
            If WebSecurity.GetUserId(email) > -1 AndAlso WebSecurity.IsConfirmed(email) Then
                resetToken = WebSecurity.GeneratePasswordResetToken(email) ' Укажите дату окончания срока действия маркера (необязательно)
            Else
                passwordSent = True ' Мы не хотим раскрывать информацию о том, что такой пользователь не существует.
                isValid = False '
            End If
        End If
        If isValid Then
            Dim hostUrl As String = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
            Dim resetUrl As String = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/PasswordReset?resetToken=" + HttpUtility.UrlEncode(resetToken))
            WebMail.Send(
                to:=email,
                subject:="Сбросьте свой пароль",
                body:="Для сброса пароля используйте следующий маркер сброса пароля. Маркер: " + resetToken + ". Чтобы сбросить пароль, перейдите по адресу: <a href=""" + HttpUtility.HtmlAttributeEncode(resetUrl) + """>" + resetUrl + "</a>."
            )
            passwordSent = True
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Используйте форму ниже для сброса пароля.</h2>
</hgroup>

@If Not WebMail.SmtpServer.IsEmpty() Then
    @<p>
        Мы отправим инструкции по сбросу пароля по адресу электронной почты, связанному с вашей учетной записью.
    </p>

    If passwordSent Then
        @<p class="message-success">
            Инструкции по сбросу пароля посланы по указанному адресу электронной почты.
        </p>
    End If

    @<form method="post">
        @AntiForgery.GetHtml()
        @Html.ValidationSummary(excludeFieldErrors:=True)

        <fieldset>
            <legend>Форма с инструкциями по сбросу пароля</legend>
            <ol>
                <li class="email">
                    <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>Адрес электронной почты</label>
                    <input type="text" id="email" name="email" value="@email" disabled="@passwordSent" @Validation.For("email") />
                    @Html.ValidationMessage("email")
                </li>
            </ol>
            <p class="form-actions">
                <input type="submit" value="Отправить инструкции" disabled="@passwordSent" />
            </p>
        </fieldset>
    </form>
Else
   @<p class="message-info">
       Для этого веб-сайта восстановление пароля отменено, поскольку SMTP-сервер 
       не настроен должным образом. Чтобы сбросить пароль, обратитесь к владельцу 
       этого сайта.
   </p>
End If