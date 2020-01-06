using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Web;
using System.Web.Services;

namespace $rootnamespace$
{
    /// <summary>
    /// Сводное описание для $classname$
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
$if$ ($targetframeworkversion$ >= 3.5)    // Чтобы разрешить вызывать веб-службу из скрипта с помощью ASP.NET AJAX, раскомментируйте следующую строку. 
    // [System.Web.Script.Services.ScriptService]$endif$
    public class $classname$ : System.Web.Services.WebService {

        [WebMethod]
        public string HelloWorld() {
            return "Привет всем!";
        }
    }
}
