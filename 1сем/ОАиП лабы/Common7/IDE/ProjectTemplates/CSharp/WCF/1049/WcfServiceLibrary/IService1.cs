using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace $safeprojectname$
{
	// ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени интерфейса "IService1" в коде и файле конфигурации.
	[ServiceContract]
	public interface IService1
	{
		[OperationContract]
		string GetData(int value);

		[OperationContract]
		CompositeType GetDataUsingDataContract(CompositeType composite);

		// TODO: Добавьте здесь операции служб
	}

	// Используйте контракт данных, как показано на следующем примере, чтобы добавить сложные типы к сервисным операциям.
	$if$ ($targetframeworkversion$ >= 4.5)// В проект можно добавлять XSD-файлы. После построения проекта вы можете напрямую использовать в нем определенные типы данных с пространством имен "$safeprojectname$.ContractType".
	$endif$[DataContract]
	public class CompositeType
	{
		bool boolValue = true;
		string stringValue = "Hello ";

		[DataMember]
		public bool BoolValue
		{
			get { return boolValue;}
			set { boolValue = value;}
		}

		[DataMember]
		public string StringValue
		{
			get { return stringValue;}
			set { stringValue = value;}
		}
	}
}
