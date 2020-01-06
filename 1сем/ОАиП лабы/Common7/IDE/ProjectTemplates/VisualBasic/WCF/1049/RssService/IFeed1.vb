' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя интерфейса "IFeed1" в коде и файле конфигурации.
<ServiceContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<ServiceKnownType(GetType(Atom10FeedFormatter))>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<ServiceKnownType(GetType(Rss20FeedFormatter))>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Interface IFeed1

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    <WebGet(UriTemplate:="*", BodyStyle:=WebMessageBodyStyle.Bare)>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function CreateFeed() As SyndicationFeedFormatter

    ' TODO: Добавьте здесь операции служб

End Interface
