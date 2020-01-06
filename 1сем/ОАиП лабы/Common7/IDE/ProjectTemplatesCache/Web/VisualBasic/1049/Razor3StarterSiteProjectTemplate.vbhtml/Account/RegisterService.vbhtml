@* Удалите этот раздел, если используется объединение *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Зарегистрироваться"

    Dim email As String = ""
    Dim loginData As String = ""
    Dim providerDisplayName As String = ""

    Dim returnUrl As String = Request.QueryString("ReturnUrl")
    If returnUrl.IsEmpty() Then
        ' Некоторые внешние поставщики входа в систему требуют всегда указывать URL-адрес возврата
        returnUrl = Href("~/")
    End If

    ' Настройка проверки
    Validation.RequireField("email", "Поле имени пользователя является обязательным.")

    If IsPost AndAlso Request.Form("newAccount").AsBool() Then
        ' Обработка формы регистрации новой учетной записи
        AntiForgery.Validate()

        email = Request.Form("email")
        loginData = Request.Form("loginData")

        Dim provider As String = ""
        Dim providerUserId As String = ""
        If WebSecurity.IsAuthenticated OrElse Not OAuthWebSecurity.TryDeserializeProviderUserId(loginData, provider, providerUserId) Then
            Response.Redirect("~/Account/Manage")
            Return
        End If

        providerDisplayName = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName
        If Validation.IsValid() Then
            ' Добавление нового пользователя в базу данных
            Dim db As Database = Database.Open("StarterSite")

            ' Проверка наличия пользователя в базе данных
            Dim user As Object = db.QuerySingle("SELECT Email FROM UserProfile WHERE LOWER(Email) = LOWER(@0)", email)
            If user Is Nothing Then
                ' Добавление адреса электронной почты в таблицу профиля
                db.Execute("INSERT INTO UserProfile (Email) VALUES (@0)", email)
                OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, email)

                OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie:= False)

                Context.RedirectLocal(returnUrl)
                Return
            Else
                ModelState.AddError("email", "Имя пользователя уже существует. Введите другое имя пользователя.")
            End If
        End If
    Else
        ' Обработка обратных вызовов от внешнего поставщика входа в систему

        Dim result As AuthenticationResult = OAuthWebSecurity.VerifyAuthentication(Href("~/Account/RegisterService", New With { .ReturnUrl = returnUrl }))
        If result.IsSuccessful Then
            Dim registered As Boolean = OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, False)
            If registered Then
                Context.RedirectLocal(returnUrl)
                Return
            End If

            If WebSecurity.IsAuthenticated Then
                ' Если текущий пользователь вошел в систему, добавить новую учетную запись
                OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, WebSecurity.CurrentUserName)
                Context.RedirectLocal(returnUrl)
                Return
            Else
                ' Новый пользователь, присвоить имени пользователя по умолчанию значение, полученное от внешнего поставщика входа в систему
                email = result.UserName
                loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId)
                providerDisplayName = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName
            End If
        Else
            Response.Redirect("~/Account/ExternalLoginFailure")
            Return
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Связывание вашей учетной записи @providerDisplayName.</h2>
</hgroup>

<form method="post">
    @AntiForgery.GetHtml()
    <input type="hidden" name="loginData" value="@loginData" />

    @* Уведомлять пользователя при наличии хотя бы одной ошибки проверки *@
    @Html.ValidationSummary(excludeFieldErrors:=True)

    <fieldset>
        <legend>Форма регистрации</legend>
        <p>
            Проверка подлинности [<strong>@providerDisplayName</strong>] пройдена. Введите
            имя пользователя для этого сайта ниже и нажмите кнопку "Подтвердить", чтобы завершить вход
            в систему.
        </p>
        <ol>
            <li class="email">
                <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text>End If>Адрес электронной почты</label>
                <input type="text" id="email" name="email" value="@email" @Validation.For("email") />
                @* Записать все ошибки проверки адреса электронной почты на странице *@
                @Html.ValidationMessage("email")
            </li>
        </ol>
        <button type="submit" name="newAccount" value="true">Зарегистрироваться</button>
    </fieldset>
</form>