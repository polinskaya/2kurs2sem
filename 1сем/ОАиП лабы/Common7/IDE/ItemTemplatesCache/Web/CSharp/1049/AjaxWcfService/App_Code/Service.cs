using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class $safeitemrootname$
{
	// Чтобы использовать протокол HTTP GET, добавьте атрибут [WebGet]. (По умолчанию ResponseFormat имеет значение WebMessageFormat.Json.)
	// Чтобы создать операцию, возвращающую XML,
	//     добавьте [WebGet(ResponseFormat=WebMessageFormat.Xml)],
	//     и включите следующую строку в текст операции:
	//         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
	[OperationContract]
	public void DoWork()
	{
		// Добавьте здесь реализацию операции
		return;
	}

	// Добавьте здесь дополнительные операции и отметьте их атрибутом [OperationContract]
}
