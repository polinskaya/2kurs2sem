﻿@Code
    WebSecurity.InitializeDatabaseConnection("StarterSite", "UserProfile", "UserId", "Email", autoCreateTables:=true)

    ' Чтобы пользователи могли входить на этот сайт, используя учетную запись с другого сайта, например Microsoft, Facebook или Twitter,
    ' следует обновить этот сайт. Дополнительные сведения: http://go.microsoft.com/fwlink/?LinkID=226949

    ' OAuthWebSecurity.RegisterMicrosoftClient(
    '     clientId:="",
    '     clientSecret:="")

    ' OAuthWebSecurity.RegisterTwitterClient(
    '     consumerKey:="",
    '     consumerSecret:="")

    ' OAuthWebSecurity.RegisterFacebookClient(
    '     appId:="",
    '     appSecret:="")

    ' OAuthWebSecurity.RegisterGoogleClient()

    ' WebMail.SmtpServer = "mailserver.example.com"
    ' WebMail.EnableSsl = True
    ' WebMail.UserName = "username@example.com"
    ' WebMail.Password = "your-password"
    ' WebMail.From = "your-name-here@example.com"

    ' Сведения об оптимизации скриптов и таблиц стилей на сайте см. по адресу http://go.microsoft.com/fwlink/?LinkID=248974
End Code