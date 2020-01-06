using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel;

namespace $rootnamespace$
{
	// ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени интерфейса "$safeitemrootname$" в коде и файле конфигурации.
	[ServiceContract]
	public interface $safeitemrootname$
	{

		[OperationContract]
		string GetData(int value);

	}
}
