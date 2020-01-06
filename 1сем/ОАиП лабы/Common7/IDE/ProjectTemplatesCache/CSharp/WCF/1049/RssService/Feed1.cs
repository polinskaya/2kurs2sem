using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Syndication;
using System.ServiceModel.Web;
using System.Text;

namespace $safeprojectname$
{
	// ПРИМЕЧАНИЕ. Команду "Переименовать" в меню "Рефакторинг" можно использовать для одновременного изменения имени класса "Feed1" в коде и файле конфигурации.
	public class Feed1 : IFeed1
	{
		public SyndicationFeedFormatter CreateFeed()
		{
			// Создать новый веб-канал.
			SyndicationFeed feed = new SyndicationFeed("Feed Title", "A WCF Syndication Feed", null);
			List<SyndicationItem> items = new List<SyndicationItem>();

			// Создать новый элемент рассылки.
			SyndicationItem item = new SyndicationItem("An item", "Item content", null);
			items.Add(item);
			feed.Items = items;

			// Возвращать канал ATOM или RSS, основываясь на строке запроса
			// RSS-&gt; http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/
			// Atom-&gt; http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/?format=atom
			string query = WebOperationContext.Current.IncomingRequest.UriTemplateMatch.QueryParameters["format"];
			SyndicationFeedFormatter formatter = null;
			if (query == "atom")
			{
				formatter = new Atom10FeedFormatter(feed);
			}
			else
			{
				formatter = new Rss20FeedFormatter(feed);
			}

			return formatter;
		}
	}
}
