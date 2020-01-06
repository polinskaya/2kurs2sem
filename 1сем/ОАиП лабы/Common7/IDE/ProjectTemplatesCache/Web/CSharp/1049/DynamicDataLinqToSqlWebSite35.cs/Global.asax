<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Routing" %>
<%@ Import Namespace="System.Web.DynamicData" %>

<script RunAt="server">
    public static void RegisterRoutes(RouteCollection routes) {
        MetaModel model = new MetaModel();
        
        //                    ВАЖНО. РЕГИСТРАЦИЯ МОДЕЛИ ДАННЫХ 
        // Раскомментируйте эту строку, чтобы зарегистрировать классы LINQ to SQL
        // для ASP.NET Dynamic Data. Задайте ScaffoldAllTables = true, только если требуется, 
        // чтобы все таблицы в модели данных поддерживали представление формирования шаблонов. 
        // Чтобы управлять технологией формирования шаблонов для отдельных таблиц, создайте разделенный класс для 
        // таблицы и примените атрибут [Scaffold(true)] к этому классу.
        // Примечание. Убедитесь, что вы изменили "YourDataContextType" на имя контекста данных
        // в вашем приложении.
        //model.RegisterContext(typeof(YourDataContextType), new ContextConfiguration() { ScaffoldAllTables = false });

        // Следующий оператор поддерживает режим отдельных страниц, в котором задачи List, Detail, Insert 
        // и Update выполняются с помощью отдельных страниц. Чтобы включить этот режим, раскомментируйте следующее 
        // определение route и закомментируйте определения route ниже в разделе режима объединенной страницы (combined-page).
        routes.Add(new DynamicDataRoute("{table}/{action}.aspx") {
            Constraints = new RouteValueDictionary(new { action = "List|Details|Edit|Insert" }),
            Model = model
        });

        // Следующие операторы поддерживают режим комбинированных страниц (combined-page), в котором задачи List, Detail, Insert и
        // и Update выполняются с помощью одной и той же страницы. Чтобы включить этот режим, раскомментируйте
        // следующие routes и закомментируйте определение route выше в разделе режима отдельных страниц.
        //routes.Add(new DynamicDataRoute("{table}/ListDetails.aspx") {
        //    Action = PageAction.List,
        //    ViewName = "ListDetails",
        //    Model = model
        //});

        //routes.Add(new DynamicDataRoute("{table}/ListDetails.aspx") {
        //    Action = PageAction.Details,
        //    ViewName = "ListDetails",
        //    Model = model
        //});
    }

    void Application_Start(object sender, EventArgs e) {
        RegisterRoutes(RouteTable.Routes);
    }

</script>
