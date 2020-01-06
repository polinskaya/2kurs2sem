using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Web;

namespace $rootnamespace$
{
    /// <summary>
    /// Сводное описание для $classname$
    /// </summary>
    public class $classname$ : IHttpHandler {

        public void ProcessRequest (HttpContext context) {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Привет всем!");
        }
     
        public bool IsReusable {
            get {
                return false;
            }
        }
    }
}