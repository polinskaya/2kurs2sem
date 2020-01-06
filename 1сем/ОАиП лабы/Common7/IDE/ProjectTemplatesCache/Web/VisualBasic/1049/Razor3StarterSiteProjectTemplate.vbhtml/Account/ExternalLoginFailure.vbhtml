@Code
    ' Задание страницы макета и заголовка страницы
    Layout = "~/_SiteLayout.vbhtml"
    Page.Title = "Ошибка при входе"
End Code

<hgroup class="title">
    <h1>@Page.Title.</h1>
    <h2>Не удалось войти через службу.</h2>
</hgroup>
