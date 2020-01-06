using System;
using System.Web;

namespace $rootnamespace$
{
    public class $safeitemrootname$ : IHttpModule
    {
        /// <summary>
        /// Вам потребуется настроить этот модуль в файле Web.config вашего
        /// веб-сайта и зарегистрировать его с помощью IIS, чтобы затем воспользоваться им.
        /// Дополнительные сведения см. по ссылке: http://go.microsoft.com/?linkid=8101007
        /// </summary>
        #region IHttpModule Members

        public void Dispose()
        {
            //удалите здесь код.
        }

        public void Init(HttpApplication context)
        {
            // Ниже приводится пример обработки события LogRequest и предоставляется 
            // настраиваемая реализация занесения данных
            context.LogRequest += new EventHandler(OnLogRequest);
        }

        #endregion

        public void OnLogRequest(Object source, EventArgs e)
        {
            //здесь можно разместить логику занесения данных
        }
    }
}
