using Microsoft.VisualStudio.DebuggerVisualizers;
using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$$if$ ($targetframeworkversion$ >= 4.5)using System.Threading.Tasks;
$endif$using System.Windows.Forms;

namespace $rootnamespace$
{
    // TODO: добавьте следующее к определению SomeType, чтобы видеть этот визуализатор при отладке экземпляров SomeType:
    // 
    //  [DebuggerVisualizer(typeof($safeitemrootname$))]
    //  [Serializable]
    //  public class SomeType
    //  {
    //   ...
    //  }
    // 
    /// <summary>
    /// Визуализатор для SomeType.  
    /// </summary>
    public class $safeitemrootname$ : DialogDebuggerVisualizer
    {
        protected override void Show(IDialogVisualizerService windowService, IVisualizerObjectProvider objectProvider)
        {
            if (windowService == null)
                throw new ArgumentNullException("windowService");
            if (objectProvider == null)
                throw new ArgumentNullException("objectProvider");

            // TODO: получите объект, для которого нужно отобразить визуализатор.
            //       Выполните приведение результата objectProvider.GetObject() 
            //       к типу визуализируемого объекта.
            object data = (object)objectProvider.GetObject();

            // TODO: отобразите свое представление объекта.
            //       Замените displayForm на свой объект Form или Control.
            using(Form displayForm = new Form())
            {
                displayForm.Text = data.ToString();
                windowService.ShowDialog(displayForm);
            }
        }

        // TODO: добавьте следующее к своему коду тестирования для тестирования визуализатора:
        // 
        //    $safeitemrootname$.TestShowVisualizer(new SomeType());
        // 
        /// <summary>
        /// Тестирует визуализатор, разместив его вне отладчика.
        /// </summary>
        /// <param name="objectToVisualize">Объект для отображения в визуализаторе.</param>
        public static void TestShowVisualizer(object objectToVisualize)
        {
            VisualizerDevelopmentHost visualizerHost = new VisualizerDevelopmentHost(objectToVisualize, typeof($safeitemrootname$));
            visualizerHost.ShowVisualizer();
        }
    }
}
