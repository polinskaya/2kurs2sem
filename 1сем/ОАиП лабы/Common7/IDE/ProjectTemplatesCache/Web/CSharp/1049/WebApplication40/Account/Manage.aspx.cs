using System;
using System.Collections.Generic;
using System.Linq;
$if$ ($targetframeworkversion$ == 4.0)
using System.Web.UI.WebControls;
$endif$
using Microsoft.AspNet.Membership.OpenAuth;

public partial class Account_Manage : System.Web.UI.Page
{
    protected string SuccessMessage
    {
        get;
        private set;
    }

    protected bool CanRemoveExternalLogins
    {
        get;
        private set;
    }

    protected void Page_Load()
    {
        if (!IsPostBack)
        {
            // Определите разделы для отображения
            var hasLocalPassword = OpenAuth.HasLocalPassword(User.Identity.Name);
            setPassword.Visible = !hasLocalPassword;
            changePassword.Visible = hasLocalPassword;

            CanRemoveExternalLogins = hasLocalPassword;

            // Отобразить сообщение об успехе
            var message = Request.QueryString["m"];
            if (message != null)
            {
                // Извлечь строку запроса из действия
                Form.Action = ResolveUrl("~/Account/Manage");

                SuccessMessage =
                    message == "ChangePwdSuccess" ? "Пароль изменен."
                    : message == "SetPwdSuccess" ? "Пароль задан."
                    : message == "RemoveLoginSuccess" ? "Внешняя учетная запись удалена."
                    : String.Empty;
                successMessage.Visible = !String.IsNullOrEmpty(SuccessMessage);
            }
        }
        $if$ ($targetframeworkversion$ == 4.0)

        // Привязка списка внешних учетных записей к данным
        var accounts = OpenAuth.GetAccountsForUser(User.Identity.Name);
        CanRemoveExternalLogins = CanRemoveExternalLogins || accounts.Count() > 1;
        externalLoginsList.DataSource = accounts;
        externalLoginsList.DataBind();
        $endif$
    }

    protected void setPassword_Click(object sender, EventArgs e)
    {
        if (IsValid)
        {
            var result = OpenAuth.AddLocalPassword(User.Identity.Name, password.Text);
            if (result.IsSuccessful)
            {
                Response.Redirect("~/Account/Manage?m=SetPwdSuccess");
            }
            else
            {
                $if$ ($targetframeworkversion$ >= 4.5)
                ModelState.AddModelError("NewPassword", result.ErrorMessage);
                $else$
                newPasswordMessage.Text = result.ErrorMessage;
                $endif$
            }
        }
    }

    $if$ ($targetframeworkversion$ >= 4.5)
    public IEnumerable<OpenAuthAccountData> GetExternalLogins()
    {
        var accounts = OpenAuth.GetAccountsForUser(User.Identity.Name);
        CanRemoveExternalLogins = CanRemoveExternalLogins || accounts.Count() > 1;
        return accounts;
    }

    public void RemoveExternalLogin(string providerName, string providerUserId)
    {
        var m = OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId)
            ? "?m=RemoveLoginSuccess"
            : String.Empty;
        Response.Redirect("~/Account/Manage" + m);
    }
    $else$
    protected void externalLoginsList_ItemDeleting(object sender, ListViewDeleteEventArgs e)
    {
        var providerName = (string)e.Keys["ProviderName"];
        var providerUserId = (string)e.Keys["ProviderUserId"];
        var m = OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId)
            ? "?m=RemoveLoginSuccess"
            : String.Empty;
        Response.Redirect("~/Account/Manage" + m);
    }

    protected T Item<T>() where T : class
    {
        return GetDataItem() as T ?? default(T);
    }
    $endif$

    protected static string ConvertToDisplayDateTime(DateTime? utcDateTime)
    {
        // Измените этот метод, чтобы преобразовать дату и время в формате UTC в нужную форму
        // отображения со смещением. Здесь они преобразуются в часовой пояс сервера и форматируются
        // как короткая дата и длинное время с использованием языка и региональных параметров текущего потока.
        return utcDateTime.HasValue ? utcDateTime.Value.ToLocalTime().ToString("G") : "[никогда]";
    }
}