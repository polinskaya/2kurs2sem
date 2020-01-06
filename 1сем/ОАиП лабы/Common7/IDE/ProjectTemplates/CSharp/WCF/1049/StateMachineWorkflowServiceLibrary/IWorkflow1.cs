using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace $safeprojectname$
{
	// ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени интерфейса "IWorkflow1" в коде и файле конфигурации.
	[ServiceContract]
	public interface IWorkflow1
	{

		[OperationContract]
		string GetData(int value);

		// TODO: Добавьте здесь операции служб
	}
}
