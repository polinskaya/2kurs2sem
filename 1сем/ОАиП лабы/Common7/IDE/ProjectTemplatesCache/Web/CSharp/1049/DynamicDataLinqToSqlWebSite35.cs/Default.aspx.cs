using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;
using System.Web.DynamicData;

public partial class _Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        System.Collections.IList visibleTables = MetaModel.Default.VisibleTables;
        if (visibleTables.Count == 0) {
            throw new InvalidOperationException("Нет ни одной доступной таблицы. Убедитесь, что по крайней мере одна модель данных зарегистрирована в Global.asax, а технология формирования шаблонов включена, либо реализуйте настраиваемые страницы.");
        }
        Menu1.DataSource = visibleTables;
        Menu1.DataBind();
    }

}
