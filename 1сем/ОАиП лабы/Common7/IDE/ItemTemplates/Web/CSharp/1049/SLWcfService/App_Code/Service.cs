using System;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;

[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class $safeitemrootname$
{
	[OperationContract]
	public void DoWork()
	{
		// Добавьте здесь реализацию операции
		return;
	}

	// Добавьте здесь дополнительные операции и отметьте их атрибутом [OperationContract]
}
