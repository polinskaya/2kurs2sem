using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Net;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace $rootnamespace$
{
    public partial class $safeitemname$: Application 
    {

        public $safeitemname$() 
        {
            this.Startup += this.Application_Startup;
            this.Exit += this.Application_Exit;
            this.UnhandledException += this.Application_UnhandledException;

            InitializeComponent();
        }

        private void Application_Startup(object sender, StartupEventArgs e) 
        {
        }

        private void Application_Exit(object sender, EventArgs e) 
        {

        }
        private void Application_UnhandledException(object sender, ApplicationUnhandledExceptionEventArgs e) 
        {
            // Если приложение выполняется вне отладчика, воспользуйтесь для сообщения об исключении
            // механизмом исключений браузера. В IE исключение будет отображаться в виде желтого значка оповещения 
            // в строке состояния, а в Firefox - в виде ошибки скрипта.
            if (!System.Diagnostics.Debugger.IsAttached) 
            {

                // ПРИМЕЧАНИЕ. Это позволит приложению выполняться после того, как исключение было выдано,
                // но не было обработано. 
                // Для рабочих приложений такую обработку ошибок следует заменить на код, 
                // оповещающий веб-сайт об ошибке и останавливающий работу приложения.
                e.Handled = true;
                Deployment.Current.Dispatcher.BeginInvoke(delegate { ReportErrorToDOM(e); });
            }
        }
        private void ReportErrorToDOM(ApplicationUnhandledExceptionEventArgs e)
        {
  	        try {
                string errorMsg = e.ExceptionObject.Message + e.ExceptionObject.StackTrace;
                errorMsg = errorMsg.Replace('"', '\'').Replace("\r\n", @"\n");

                System.Windows.Browser.HtmlPage.Window.Eval("throw new Error(\"Unhandled Error in Silverlight 2 Application " + errorMsg + "\");");
            }
            catch (Exception) {
            }
        }
    }
}
