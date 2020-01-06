﻿<!DOCTYPE html>
<html lang="ru">
    <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta charset="utf-8" />
        <title>@PageData("Title") - веб-страница ASP.NET</title>
        <link href="~/Content/themes/base/jquery.ui.all.css" rel="stylesheet" type="text/css" />
        <link href="~/Content/Site.css" rel="stylesheet" type="text/css" />
        <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <script src="~/Scripts/jquery-1.10.2.min.js"></script>
        <script src="~/Scripts/jquery-ui-1.10.3.js"></script>
        <script src="~/Scripts/modernizr-2.6.2.js"></script>
        <meta name="viewport" content="width=device-width" />
    </head>
    <body>
        <header>
            <div class="content-wrapper">
                <div class="float-left">
                    <p class="site-title"><a href="~/">ваша эмблема здесь</a></p>
                </div>
                <div class="float-right">
                    <section id="login">
                        @If WebSecurity.IsAuthenticated Then
                            @<text>
                                Здравствуйте, <a class="email" href="~/Account/Manage" title="Manage">@WebSecurity.CurrentUserName</a>!
                                <form id="logoutForm" action="~/Account/Logout" method="post">
                                    @AntiForgery.GetHtml()
                                    <a href="javascript:document.getElementById('logoutForm').submit()">Выйти</a>
                                </form>
                            </text>
                        Else
                            @<ul>
                                <li><a href="~/Account/Register">Регистрация</a></li>
                                <li><a href="~/Account/Login">Выполнить вход</a></li>
                            </ul>
                        End If
                    </section>
                    <nav>
                        <ul id="menu">
                            <li><a href="~/">Домашняя</a></li>
                            <li><a href="~/About">О программе</a></li>
                            <li><a href="~/Contact">Контакт</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
        <div id="body">
            @RenderSection("featured", required:=false)
            <section class="content-wrapper main-content clear-fix">
                @RenderBody()
            </section>
        </div>
        <footer>
            <div class="content-wrapper">
                <div class="float-left">
                    <p>&copy; @DateTime.Now.Year - Моя веб-страница ASP.NET</p>
                </div>
            </div>
        </footer>

        @RenderSection("Scripts", required:=False)
    </body>
</html>