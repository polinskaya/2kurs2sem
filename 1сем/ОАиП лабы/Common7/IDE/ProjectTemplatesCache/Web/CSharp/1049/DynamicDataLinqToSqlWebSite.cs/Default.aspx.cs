using System;
using System.ComponentModel.DataAnnotations;
using System.Web.DynamicData;

public partial class _Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        System.Collections.IList visibleTables = ASP.global_asax.DefaultModel.VisibleTables;
        if (visibleTables.Count == 0) {
            throw new InvalidOperationException("Нет ни одной доступной таблицы. Убедитесь, что по крайней мере одна модель данных зарегистрирована в Global.asax, а технология формирования шаблонов включена, либо реализуйте настраиваемые страницы.");
        }
        Menu1.DataSource = visibleTables;
        Menu1.DataBind();
    }

}
