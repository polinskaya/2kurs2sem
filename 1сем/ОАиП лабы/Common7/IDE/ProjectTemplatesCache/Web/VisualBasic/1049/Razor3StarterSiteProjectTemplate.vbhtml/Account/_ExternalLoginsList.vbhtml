﻿@If OAuthWebSecurity.RegisteredClientData.Count = 0 Then
    @<div class="message-info">
        <p>
            Внешние службу проверки подлинности не настроены. См. в <a href="http://go.microsoft.com/fwlink/?LinkId=226949">этой статье</a>
            сведения о настройке входа через сторонние службы в этом приложении ASP.NET.
        </p>
    </div>
Else
    @<form method="post">
    @AntiForgery.GetHtml()
    <fieldset id="socialLoginList">
        <legend>Вход через другую службу</legend>
        <p>
            @For Each client As AuthenticationClientData In OAuthWebSecurity.RegisteredClientData
                @<button type="submit" name="provider" value="@client.AuthenticationClient.ProviderName"
                         title="Войдите, используя свою учетную запись @client.DisplayName">@client.DisplayName</button>
            Next
        </p>
    </fieldset>
    </form>
End If