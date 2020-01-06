@* Удалите этот раздел при использовании пакетного режима *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Зарегистрироваться"

    ' Инициализировать общие переменные страницы
    Dim email As String = ""
    Dim password As String = ""
    Dim confirmPassword As String = ""

    ' Настройка проверки
    Validation.RequireField("email", "Поле электронной почты заполнять обязательно.")
    Validation.RequireField("password", "Пароль не может быть пустым.")
    Validation.Add("confirmPassword",
        Validator.EqualsTo("password", "Пароль и его подтверждение не совпадают."))
    Validation.Add("password",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="Пароль не может быть короче 6 символов"))

    ' Если это запрос POST , проверяем и обрабатываем данные
    If IsPost Then
        AntiForgery.Validate()
        email = Request.Form("email")
        password = Request.Form("password")
        confirmPassword = Request.Form("confirmPassword")

        ' Проверка символов, вводимых пользователем в ответ на запрос CAPTCHA
        ' If Not ReCaptcha.Validate("PRIVATE_KEY")) Then
        '     ModelState.AddError("recaptcha", "Captcha неправильный ответ")
        ' End If

        ' Если все сведения указаны правильно, создается учетная запись
        If Validation.IsValid() Then
            ' Добавление нового пользователя в базу данных
            Dim db As Database = Database.Open("StarterSite")

            ' Проверка наличия пользователя в базе данных
            Dim user As Object = db.QuerySingle("SELECT Email FROM UserProfile WHERE LOWER(Email) = LOWER(@0)", email)
            If user Is Nothing Then
                ' Добавление адреса электронной почты в таблицу профиля
                db.Execute("INSERT INTO UserProfile (Email) VALUES (@0)", email)

                ' Создание и связывание новой записи в базе данных членства.
                ' Если проверка пройдена, обработка запроса продолжается
                Try
                    Dim requireEmailConfirmation As Boolean = Not WebMail.SmtpServer.IsEmpty()
                    Dim token As String = WebSecurity.CreateAccount(email, password, requireEmailConfirmation)
                    If requireEmailConfirmation Then
                        Dim hostUrl As String = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
                        Dim confirmationUrl As String = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/Confirm?confirmationCode=" + HttpUtility.UrlEncode(token))

                        WebMail.Send(
                            to:=email,
                            subject:="Подтвердите учетную запись",
                            body:="Ваш код подтверждения:: " + token + ". Активируйте учетную запись по адресу <a href=""" + confirmationUrl + """>" + confirmationUrl + "</a>  ."
                        )
                    End If

                    If requireEmailConfirmation Then
                        ' Выражение благодарности за регистрацию и напоминание о письме, отправленном по указанному адресу
                        Response.Redirect("~/Account/Thanks")
                    Else
                        ' Переход на домашнюю страницу и выход
                        WebSecurity.Login(email, password)

                        Response.Redirect("~/")
                    End If
                Catch e As System.Web.Security.MembershipCreateUserException
                    ModelState.AddFormError(e.Message)
                End Try
            Else
                ' Пользователь уже существует
                ModelState.AddFormError("Указанный адрес электронной почты уже используется другим пользователем.")
            End If
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Создание новой учетной записи.</h2>
</hgroup>

<form method="post">
    @AntiForgery.GetHtml()
    @* Уведомлять пользователя при наличии хотя бы одной ошибки проверки *@
    @Html.ValidationSummary("Не удалось создать учетную запись. Исправьте ошибки и повторите попытку.", excludeFieldErrors:=True, htmlAttributes:=Nothing)

    <fieldset>
        <legend>Форма регистрации</legend>
        <ol>
            <li class="email">
                <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>Адрес электронной почты</label>
                <input type="text" id="email" name="email" value="@email" @Validation.For("email") />
                @* Записать все ошибки проверки адреса электронной почты на странице *@
                @Html.ValidationMessage("email")
            </li>
            <li class="password">
                <label for="password" @If Not ModelState.IsValidField("password") Then@<text>class="error-label"</text> End If>Пароль</label>
                <input type="password" id="password" name="password" @Validation.For("password") />
                @* Записать все ошибки проверки пароля на странице *@
                @Html.ValidationMessage("password")
            </li>
            <li class="confirm-password">
                <label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>Подтверждение пароля</label>
                <input type="password" id="confirmPassword" name="confirmPassword" @Validation.For("confirmPassword") />
                @* Записать все ошибки проверки пароля на странице *@
                @Html.ValidationMessage("confirmPassword")
            </li>
            <li class="recaptcha">
                <div class="message-info">
                    <p>
                        Чтобы включить проверку CAPTCHA ,, <a href="http://go.microsoft.com/fwlink/?LinkId=204140">установите 
                        ASP.NET Web Helpers Library</a> , раскомментируйте ReCaptcha.GetHtml и замените 'PUBLIC_KEY'
                        на свой открытый ключ. Раскомментируйте в верхней части страницы ReCaptcha. Validate и
                        замените 'PRIVATE_KEY' на свой закрытый ключ.
                        Зарегистрируйте ключи reCAPTCHA на сайте <a href="http://recaptcha.net">reCAPTCHA.net</a>.
                    </p>
                </div>
                @*
                @ReCaptcha.GetHtml("PUBLIC_KEY", theme:="white")
                @Html.ValidationMessage("recaptcha")
                *@
            </li>
        </ol>
        <input type="submit" value="Регистрация" />
    </fieldset>
</form>