' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя класса "Feed1" в коде и файле конфигурации.
Public Class Feed1
    Implements IFeed1

    Public Function CreateFeed() As SyndicationFeedFormatter Implements IFeed1.CreateFeed
        ' Создать новый веб-канал.
        Dim feed As New SyndicationFeed("Feed Title", "A WCF Syndication Feed", Nothing)
        Dim items As New List(Of SyndicationItem)

        ' Создать новый элемент рассылки.
        Dim item As New SyndicationItem("An item", "Item content", Nothing)
        items.Add(item)
        feed.Items = items

        ' Возвращать канал ATOM или RSS, основываясь на строке запроса
        ' RSS-&gt; http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/
        ' Atom-&gt; http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/?format=atom
        Dim query As String = WebOperationContext.Current.IncomingRequest.UriTemplateMatch.QueryParameters.Get("format")
        Dim formatter As SyndicationFeedFormatter = Nothing
        If (query = "atom") Then
            formatter = New Atom10FeedFormatter(feed)
        Else
            formatter = New Rss20FeedFormatter(feed)
        End If

        Return formatter
    End Function

End Class
