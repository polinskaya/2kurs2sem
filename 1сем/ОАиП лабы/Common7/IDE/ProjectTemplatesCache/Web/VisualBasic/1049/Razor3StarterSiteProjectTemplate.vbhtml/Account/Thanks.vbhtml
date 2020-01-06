@Code
    ' Задание страницы макета и заголовка страницы
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Благодарим за регистрацию"
End Code

@If Not WebSecurity.IsAuthenticated Then
    @<hgroup class="title">
        <h1>@PageData("Title").</h1>
        <h2>Учетная запись еще не активирована.</h2>
    </hgroup>

    @<p>
       По указанному адресу отправлено письмо с инструкциями по активации учетной записи.
    </p>
Else
    @<hgroup class="title">
        <h1>@PageData("Title").</h1>
        <h2>Учетная запись активирована.</h2>
    </hgroup>

    @<p>
        По-видимому, ваша учетная запись уже подтверждена.
    </p>
End If