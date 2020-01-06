using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace $rootnamespace$
{
	// ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени интерфейса "$safeitemrootname$" в коде и файле конфигурации.
	[ServiceContract]
	public interface $safeitemrootname$
	{
		[OperationContract]
		void DoWork();
	}
}
