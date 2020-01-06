<%@ Application Language="C#" %>
<%@ Import Namespace="$safeprojectname$" %>
<%@ Import Namespace="System.Web.Routing" %>

<script runat="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Код, выполняемый при запуске приложения
        AuthConfig.RegisterOpenAuth();
        RouteConfig.RegisterRoutes(RouteTable.Routes);
    }
    
    void Application_End(object sender, EventArgs e)
    {
        //  Код, выполняемый при завершении работы приложения

    }

    void Application_Error(object sender, EventArgs e)
    {
        // Код, выполняемый при появлении необработанной ошибки

    }

</script>
