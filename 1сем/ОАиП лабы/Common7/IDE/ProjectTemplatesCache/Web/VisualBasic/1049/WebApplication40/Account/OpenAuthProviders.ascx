<%@ Control Language="VB" AutoEventWireup="false" CodeFile="OpenAuthProviders.ascx.vb" Inherits="Account_OpenAuthProviders" %>
$if$ ($targetframeworkversion$ == 4.0)<%@ Import Namespace="Microsoft.AspNet.Membership.OpenAuth" %>$endif$

<fieldset class="open-auth-providers">
    <legend>Войти, используя другую службу</legend>
    $if$ ($targetframeworkversion$ >= 4.5)
    <asp:ListView runat="server" ID="providerDetails" ItemType="Microsoft.AspNet.Membership.OpenAuth.ProviderDetails"
        SelectMethod="GetProviderNames" ViewStateMode="Disabled">
        <ItemTemplate>
            <button type="submit" name="provider" value="<%#: Item.ProviderName %>"
                title="Войдите, используя <%#: Item.ProviderDisplayName %> свою учетную запись.">
                <%#: Item.ProviderDisplayName %>
            </button>
        </ItemTemplate>
    $else$
    <asp:ListView runat="server" ID="providersList" ViewStateMode="Disabled">
        <ItemTemplate>
            <button type="submit" name="provider" value="<%# HttpUtility.HtmlAttributeEncode(Item(Of ProviderDetails)().ProviderName) %>"
                title="Войдите, используя <%# HttpUtility.HtmlAttributeEncode(Item(Of ProviderDetails)().ProviderDisplayName) %> свою учетную запись.">
                <%# HttpUtility.HtmlEncode(Item(Of ProviderDetails)().ProviderDisplayName) %>
            </button>
        </ItemTemplate>
    $endif$
        <EmptyDataTemplate>
            <div class="message-info">
                <p>Внешние службы проверки подлинности не настроены. См. в <a href="http://go.microsoft.com/fwlink/?LinkId=252803">этой статье</a> сведения о настройке входа через сторонние службы в этом приложении ASP.NET.</p>
            </div>
        </EmptyDataTemplate>
    </asp:ListView>
</fieldset>