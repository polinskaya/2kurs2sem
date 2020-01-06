@* Удалите этот раздел, если используется объединение *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    WebSecurity.RequireAuthenticatedUser()

    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Управление учетной записью"

    Dim action As String = Request.Form("action")

    Dim hasLocalAccount As Boolean = OAuthWebSecurity.HasLocalAccount(WebSecurity.CurrentUserId)

    Dim successMessage As String = ""
    Dim message As String = Request.QueryString("message")
    If message = "ChangedPassword" Then
        successMessage = "Пароль изменен."
    ElseIf message = "SetPassword" Then
        successMessage = "Пароль задан."
    ElseIf message = "RemovedLogin" Then
        successMessage = "Внешнее имя входа удалено."
    End If

    Dim externalLogins =
        (From account In OAuthWebSecurity.GetAccountsFromUserName(WebSecurity.CurrentUserName)
         Let clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider)
         Select New With { .Provider = account.Provider, .ProviderDisplayName = clientData.DisplayName, .UserId = account.ProviderUserId }).ToList()
    Dim canRemoveLogin As Boolean = externalLogins.Count > 1 OrElse hasLocalAccount

    ' Настройка проверки
    If hasLocalAccount Then
        Validation.RequireField("currentPassword", "Поле текущего пароля является обязательным.")
        Validation.Add("currentPassword",
            Validator.StringLength(
                maxLength:=Int32.MaxValue,
                minLength:=6,
                errorMessage:="Текущий пароль должен содержать не менее 6 символов"))
    End If
    Validation.RequireField("newPassword", "Поле нового пароля является обязательным.")
    Validation.Add("confirmPassword",
        Validator.Required("Поле подтверждения нового пароля является обязательным."),
        Validator.EqualsTo("newPassword", "Новый пароль и его подтверждение не совпадают."))
    Validation.Add("newPassword",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="Новый пароль должен содержать не менее 6 символов"))

    If IsPost Then
        AntiForgery.Validate()
        If action = "password" Then
            ' Обработка операций с паролем локальной учетной записи
            Dim currentPassword As String = Request.Form("currentPassword")
            Dim newPassword As String = Request.Form("newPassword")
            Dim confirmPassword As String = Request.Form("confirmPassword")

            If Validation.IsValid() Then
                If hasLocalAccount Then
                    If WebSecurity.ChangePassword(WebSecurity.CurrentUserName, currentPassword, newPassword) Then
                        Response.Redirect("~/Account/Manage?message=ChangedPassword")
                        Return
                    Else
                        ModelState.AddFormError("При попытке сменить пароль возникла ошибка. Обратитесь к владельцу сайта.")
                    End If
                Else
                    Dim requireEmailConfirmation As Boolean = Not WebMail.SmtpServer.IsEmpty()
                    Try
                        WebSecurity.CreateAccount(WebSecurity.CurrentUserName, newPassword, requireEmailConfirmation)
                        Response.Redirect("~/Account/Manage?message=SetPassword")
                        Return
                    Catch e As System.Web.Security.MembershipCreateUserException
                        ModelState.AddFormError(e.Message)
                    End Try
                End If
            Else
                ModelState.AddFormError("Не удалось сменить пароль. Исправьте ошибки и повторите попытку.")
            End If
        ElseIf action = "removeLogin" Then
            ' Удалить внешнее имя входа
            Dim provider As String = Request.Form("provider")
            Dim userId As String = Request.Form("userId")

            message = Nothing
            Dim ownerAccount As String = OAuthWebSecurity.GetUserName(provider, userId)
            ' Удалять внешнее имя входа, только если оно принадлежит текущему пользователю, выполнившему вход, и не является его учетными данными, которые были использованы при последнем входе в систему
            If ownerAccount = WebSecurity.CurrentUserName AndAlso canRemoveLogin Then
                OAuthWebSecurity.DeleteAccount(provider, userId)
                message = "RemovedLogin"
            End If
            Response.Redirect(Href("~/Account/Manage", New With { message }))
            Return
        Else
            ' Предположить, что это внешний запрос входа в систему
            Dim provider As String = Request.Form("provider")
            If Not provider.IsEmpty() Then
                OAuthWebSecurity.RequestAuthentication(provider, Href("~/Account/RegisterService", New With {.returnUrl = Href("~/Account/Manage")}))
                Return
            End If
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
</hgroup>

@If Not successMessage.IsEmpty() Then
    @<p class="message-success">
        @successMessage
    </p>
End If

<p>Вы выполнили вход как <strong>@WebSecurity.CurrentUserName</strong>.</p>

@If hasLocalAccount Then
    @<h2>Смена пароля</h2>
Else
    @<h3>Задать локальный пароль</h3>
    @<p>
        У вас отсутствует локальный пароль для этого сайта. Добавьте локальный пароль, чтобы можно было выполнять вход без использования внешнего имени входа.
    </p>
End If

<form method="post">
    @AntiForgery.GetHtml()
    @Html.ValidationSummary(excludeFieldErrors:=True)

    <fieldset>
        <legend>
        @If hasLocalAccount Then
            @<text>Форма смены пароля</text>
        Else
            @<text>Форма задания пароля</text>
        End If
        </legend>
        <ol>
            @If hasLocalAccount Then
                @<li class="current-password">
                    <label for="currentPassword" @If Not ModelState.IsValidField("currentPassword") Then@<text>class="error-label"</text> End If>Текущий пароль</label>
                    <input type="password" id="currentPassword" name="currentPassword" @Validation.For("currentPassword")/>
                    @Html.ValidationMessage("currentPassword")
                </li>
            End If
            <li class="new-password">
                <label for="newPassword" @If Not ModelState.IsValidField("newPassword") Then@<text>class="error-label"</text> End If>Новый пароль</label>
                <input type="password" id="newPassword" name="newPassword" @Validation.For("newPassword")/>
                @Html.ValidationMessage("newPassword")
            </li>
            <li class="confirm-password">
                <label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>Подтверждение пароля</label>
                <input type="password" id="confirmPassword" name="confirmPassword" @Validation.For("confirmPassword")/>
                @Html.ValidationMessage("confirmPassword")
            </li>
        </ol>
        @If hasLocalAccount Then
            @<button type="submit" name="action" value="password">Смена пароля</button>
            @<p>
                Если вы забыли свой пароль, щелкните <a href="~/Account/ForgotPassword" title="Страница сброса пароля">здесь</a>.
            </p>
        Else
            @<button type="submit" name="action" value="password">Задать пароль</button>
        End If
    </fieldset>
</form>

<section id="externalLogins">
    @If externalLogins.Count > 0 Then
        @<h3>Зарегистрированные внешние имена входа</h3>
        @<table>
            <tbody>
            @For Each externalLogin In externalLogins
                @<tr>
                    <td>@externalLogin.ProviderDisplayName</td>
                    <td>
                        @If canRemoveLogin Then
                            @<form method="post">
                                @AntiForgery.GetHtml()
                                <fieldset>
                                    <legend></legend>
                                    <input type="hidden" name="provider" value="@externalLogin.Provider" />
                                    <input type="hidden" name="userId" value="@externalLogin.UserId" />
                                    <button type="submit" name="action" value="removeLogin" title="Удалить эти учетные данные @externalLogin.ProviderDisplayName из вашей учетной записи">Удалить</button>
                                </fieldset>
                            </form>
                        Else
                            @: &nbsp;
                        End If
                    </td>
                </tr>
            Next
            </tbody>
        </table>
    End If

    <h3>Добавить внешнее имя входа</h3>
    @RenderPage("~/Account/_ExternalLoginsList.vbhtml")
</section>
