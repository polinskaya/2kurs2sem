@* Удалите этот раздел, если используется объединение *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Вход"

    ' Инициализировать общие переменные страницы
    Dim email As String = ""
    Dim password As String = ""
    Dim rememberMe As Boolean = False

    Dim returnUrl As String = Request.QueryString("ReturnUrl")
    If returnUrl.IsEmpty() Then
        ' Некоторые внешние поставщики входа в систему требуют всегда указывать URL-адрес возврата
        returnUrl = Href("~/")
    End If

    ' Настройка проверки
    Validation.RequireField("email", "Необходимо указать адрес электронной почты.")
    Validation.RequireField("password", "Необходимо указать пароль.")
    Validation.Add("password",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="Пароль должен содержать не менее 6 символов"))

    ' Если получен запрос POST, выполняется проверка и обработка данных
    If IsPost Then
        AntiForgery.Validate()
        ' это внешний запрос входа в систему?
        Dim provider As String = Request.Form("provider")
        If Not Provider.IsEmpty() Then
            OAuthWebSecurity.RequestAuthentication(Provider, Href("~/Account/RegisterService", New With { .ReturnUrl = returnUrl }))
            Return
        ElseIf Validation.IsValid() Then
            email = Request.Form("email")
            password = Request.Form("password")
            rememberMe = Request.Form("rememberMe").AsBool()

            If WebSecurity.UserExists(email) AndAlso WebSecurity.GetPasswordFailuresSinceLastSuccess(email) > 4 AndAlso WebSecurity.GetLastPasswordFailureDate(email).AddSeconds(60) > DateTime.UtcNow Then
                Response.Redirect("~/Account/AccountLockedOut")
                Return
            End If

            ' Попытка войти с помощью предоставленных учетных данных
            If WebSecurity.Login(email, password, rememberMe) Then
                Context.RedirectLocal(returnUrl)
                Return
            Else
                ModelState.AddFormError("Введено неправильное имя пользователя или пароль.")
            End If
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
</hgroup>

<section id="loginForm">
    <h2>Использовать локальную учетную запись для входа в систему.</h2>
    <form method="post">
        @AntiForgery.GetHtml()
        @* Если при проверке обнаружена хотя бы одна ошибка, покажите ошибку *@
        @Html.ValidationSummary("Вход в систему не выполнен. Исправьте ошибки и повторите попытку.", excludeFieldErrors:=True, htmlAttributes:=Nothing)

        <fieldset>
            <legend>Войдите в свою учетную запись</legend>
            <ol>
                <li class="email">
                    <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>Адрес электронной почты</label>
                    <input type="text" id="email" name="email" value="@email" @Validation.For("email")/>
                    @* Записать все ошибки проверки имени пользователя на странице *@
                    @Html.ValidationMessage("email")
                </li>
                <li class="password">
                    <label for="password" @If Not ModelState.IsValidField("password") Then@<text>class="error-label"</text> End If>Пароль</label>
                    <input type="password" id="password" name="password" @Validation.For("password")/>
                    @* Записать все ошибки проверки пароля на странице *@
                    @Html.ValidationMessage("password")
                </li>
                <li class="remember-me">
                    <input type="checkbox" id="rememberMe" name="rememberMe" value="true" checked="@rememberMe" />
                    <label class="checkbox" for="rememberMe">Запомнить меня</label>
                </li>
            </ol>
            <input type="submit" value="Вход" />
        </fieldset>
    </form>
    <p>
        <a href="~/Account/Register">Отсутствует учетная запись?</a>
        <a href="~/Account/ForgotPassword">Забыли свой пароль?</a>
    </p>
</section>

<section class="social" id="socialLoginForm">
    <h2>Использовать для входа другую службу.</h2>
     @RenderPage("~/Account/_ExternalLoginsList.vbhtml")
</section>
