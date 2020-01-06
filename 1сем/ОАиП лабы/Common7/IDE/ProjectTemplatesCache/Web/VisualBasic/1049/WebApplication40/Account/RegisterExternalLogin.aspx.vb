Imports System.Web.Security
Imports DotNetOpenAuth.AspNet
Imports Microsoft.AspNet.Membership.OpenAuth

Partial Class Account_RegisterExternalLogin
    Inherits System.Web.UI.Page

    Protected Property ProviderName As String
        Get
            Return If(DirectCast(ViewState("ProviderName"), String), String.Empty)
        End Get
        Private Set(value As String)
            ViewState("ProviderName") = value
        End Set
    End Property

    Protected Property ProviderDisplayName As String
        Get
            Return If(DirectCast(ViewState("PropertyProviderDisplayName"), String), String.Empty)
        End Get
        Private Set(value As String)
            ViewState("ProviderDisplayName") = value
        End Set
    End Property

    Protected Property ProviderUserId As String
        Get
            Return If(DirectCast(ViewState("ProviderUserId"), String), String.Empty)
        End Get

        Private Set(value As String)
            ViewState("ProviderUserId") = value
        End Set
    End Property

    Protected Property ProviderUserName As String
        Get
            Return If(DirectCast(ViewState("ProviderUserName"), String), String.Empty)
        End Get

        Private Set(value As String)
            ViewState("ProviderUserName") = value
        End Set
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ProcessProviderResult()
        End If
    End Sub

    Protected Sub logIn_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        CreateAndLoginUser()
    End Sub

    Protected Sub cancel_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        RedirectToReturnUrl()
    End Sub

    Private Sub ProcessProviderResult()
        ' Обработка результата от поставщика проверки подлинности в запросе
        ProviderName = OpenAuth.GetProviderNameFromCurrentRequest()

        If String.IsNullOrEmpty(ProviderName) Then
            Response.Redirect(FormsAuthentication.LoginUrl)
        End If

        ProviderDisplayName = OpenAuth.GetProviderDisplayName(ProviderName)

        ' Построение URL-адреса перенаправления для проверки OpenAuth
        Dim redirectUrl As String = "~/Account/RegisterExternalLogin"
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        If Not String.IsNullOrEmpty(returnUrl) Then
            redirectUrl &= "?ReturnUrl=" & HttpUtility.UrlEncode(returnUrl)
        End If

        ' Проверка данных OpenAuth
        Dim authResult As AuthenticationResult = OpenAuth.VerifyAuthentication(redirectUrl)
        If Not authResult.IsSuccessful Then
            Title = "Ошибка внешней учетной записи"
            userNameForm.Visible = False
            $if$ ($targetframeworkversion$ >= 4.5)
            ModelState.AddModelError("Provider", String.Format("Ошибка внешнего входа через {0}.", ProviderDisplayName))
            $else$
            providerMessage.Text = String.Format("Ошибка внешней учетной записи {0}.", ProviderDisplayName)
            $endif$
            ' Чтобы просмотреть ошибку, включите трассировку страниц в файле web.config (<system.web><trace enabled="true"/></system.web>) и откройте адрес ~/Trace.axd
            Trace.Warn("OpenAuth", String.Format("Ошибка при проверке подлинности через {0})", ProviderDisplayName), authResult.Error)
            Return
        End If

        ' Пользователь успешно вошел через поставщика
        ' Проверка того, не зарегистрирован ли пользователь локально
        If OpenAuth.Login(authResult.Provider, authResult.ProviderUserId, createPersistentCookie:=False) Then
            RedirectToReturnUrl()
        End If

        ' Сохранение сведений о поставщике в ViewState
        ProviderName = authResult.Provider
        ProviderUserId = authResult.ProviderUserId
        ProviderUserName = authResult.UserName

        ' Извлечь строку запроса из действия
        Form.Action = ResolveUrl(redirectUrl)

        If (User.Identity.IsAuthenticated) Then
            ' Пользователь проверен, добавляем внешнюю учетную запись и переходим на URL-адрес возврата
            OpenAuth.AddAccountToExistingUser(ProviderName, ProviderUserId, ProviderUserName, User.Identity.Name)
            RedirectToReturnUrl()
        Else
            ' Новый пользователь, запрашиваем желаемое имя участника
            userName.Text = authResult.UserName
        End If
    End Sub

    Private Sub CreateAndLoginUser()
        If Not IsValid Then
            Return
        End If

        Dim createResult As CreateResult = OpenAuth.CreateUser(ProviderName, ProviderUserId, ProviderUserName, userName.Text)

        If Not createResult.IsSuccessful Then
            $if$ ($targetframeworkversion$ >= 4.5)
            ModelState.AddModelError("UserName", createResult.ErrorMessage)
            $else$
            userNameMessage.Text = createResult.ErrorMessage
            $endif$
        Else
            ' Пользователь успешно создан и связан
            If OpenAuth.Login(ProviderName, ProviderUserId, createPersistentCookie:=False) Then
                RedirectToReturnUrl()
            End If
        End If
    End Sub

    Private Sub RedirectToReturnUrl()
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        If Not String.IsNullOrEmpty(returnUrl) And OpenAuth.IsLocalUrl(returnUrl) Then
            Response.Redirect(returnUrl)
        Else
            Response.Redirect("~/")
        End If
    End Sub
End Class
