Imports System.Collections.Generic
$if$ ($targetframeworkversion$ == 4.0)
Imports System.Web.UI.WebControls
$endif$
Imports Microsoft.AspNet.Membership.OpenAuth

Partial Class Account_Manage
    Inherits System.Web.UI.Page

    Private successMessageTextValue As String
    Protected Property SuccessMessageText As String
        Get
            Return successMessageTextValue
        End Get
        Private Set(value As String)
            successMessageTextValue = value
        End Set
    End Property

    Private canRemoveExternalLoginsValue As Boolean
    Protected Property CanRemoveExternalLogins As Boolean
        Get
            Return canRemoveExternalLoginsValue
        End Get
        Set(value As Boolean)
            canRemoveExternalLoginsValue = value
        End Set
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ' Определите разделы для отображения
            Dim hasLocalPassword = OpenAuth.HasLocalPassword(User.Identity.Name)
            setPassword.Visible = Not hasLocalPassword
            changePassword.Visible = hasLocalPassword

            CanRemoveExternalLogins = hasLocalPassword

            ' Отобразить сообщение об успехе
            Dim message = Request.QueryString("m")
            If Not message Is Nothing Then
                ' Извлечь строку запроса из действия
                Form.Action = ResolveUrl("~/Account/Manage")

                Select Case message
                    Case "ChangePwdSuccess"
                        SuccessMessageText = "Пароль изменен."
                    Case "SetPwdSuccess"
                        SuccessMessageText = "Пароль задан."
                    Case "RemoveLoginSuccess"
                        SuccessMessageText = "Внешняя учетная запись удалена."
                    Case Else
                        SuccessMessageText = String.Empty
                End Select

                successMessage.Visible = Not String.IsNullOrEmpty(SuccessMessageText)
            End If
        End If

         $if$ ($targetframeworkversion$ == 4.0)
        ' Привязка списка внешних учетных записей к данным
        Dim accounts As IEnumerable(Of OpenAuthAccountData) = OpenAuth.GetAccountsForUser(User.Identity.Name)
        CanRemoveExternalLogins = CanRemoveExternalLogins Or accounts.Count() > 1
        externalLoginsList.DataSource = accounts
        externalLoginsList.DataBind()
        $endif$
    End Sub

    Protected Sub setPassword_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        If IsValid Then
            Dim result As SetPasswordResult = OpenAuth.AddLocalPassword(User.Identity.Name, password.Text)
            If result.IsSuccessful Then
                Response.Redirect("~/Account/Manage?m=SetPwdSuccess")
            Else
                $if$ ($targetframeworkversion$ >= 4.5)
                ModelState.AddModelError("NewPassword", result.ErrorMessage)
                $else$
                newPasswordMessage.Text = result.ErrorMessage
                $endif$
            End If
        End If
    End Sub

    $if$ ($targetframeworkversion$ >= 4.5)
    Public Function GetExternalLogins() As IEnumerable(Of OpenAuthAccountData)
        Dim accounts = OpenAuth.GetAccountsForUser(User.Identity.Name)
        CanRemoveExternalLogins = CanRemoveExternalLogins OrElse accounts.Count() > 1
        Return accounts
    End Function

    Public Sub RemoveExternalLogin(ByVal providerName As String, ByVal providerUserId As String)
        Dim m = If(OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId), "?m=RemoveLoginSuccess", String.Empty)
        Response.Redirect("~/Account/Manage" & m)
    End Sub
    $else$
    Protected Sub externalLoginsList_ItemDeleting(ByVal sender As Object, ByVal e As ListViewDeleteEventArgs)
        Dim providerName As String = DirectCast(e.Keys("ProviderName"), String)
        Dim providerUserId As String = DirectCast(e.Keys("ProviderUserId"), String)
        Dim m As String = If(OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId), "?m=RemoveLoginSuccess", String.Empty)
        Response.Redirect("~/Account/Manage" & m)
    End Sub

    Protected Function Item(Of T As Class)() As T
        Return TryCast(GetDataItem(), T)
    End Function
    $endif$

    Protected Shared Function ConvertToDisplayDateTime(ByVal utcDateTime As Nullable(Of DateTime)) As String
        ' Измените этот метод, чтобы преобразовать дату и время в формате UTC в нужную форму
        ' отображения со смещением. Здесь они преобразуются в часовой пояс сервера и форматируются
        ' как короткая дата и длинное время с использованием языка и региональных параметров текущего потока.
        Return If(utcDateTime.HasValue, utcDateTime.Value.ToLocalTime().ToString("G"), "[никогда]")
    End Function
End Class
