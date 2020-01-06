using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

// ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в меню "Рефакторинг", чтобы изменить имя интерфейса "$safeitemrootname$" в коде и файле конфигурации.
[ServiceContract]
public interface $safeitemrootname$
{
	[OperationContract]
	void DoWork();
}
