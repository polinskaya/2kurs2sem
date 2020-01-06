Imports System.ServiceModel

' ПРИМЕЧАНИЕ. Можно использовать команду "Переименовать" в контекстном меню, чтобы изменить имя интерфейса "$safeitemrootname$" в коде и файле конфигурации.
<ServiceContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Interface $safeitemrootname$

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Sub DoWork()

End Interface
