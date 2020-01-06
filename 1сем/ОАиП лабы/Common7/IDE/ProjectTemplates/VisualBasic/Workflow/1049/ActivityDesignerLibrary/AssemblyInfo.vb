Imports System
Imports System.Reflection
Imports System.Runtime.InteropServices
Imports System.Globalization
Imports System.Resources
Imports System.Windows

' Управление общими сведениями о сборке осуществляется с помощью указанного ниже 
' набора атрибутов. Измените значения этих атрибутов, чтобы изменить сведения,
' связанные со сборкой.

' Проверьте значения атрибутов сборки
<Assembly: AssemblyTitle("$projectname$")> 
<Assembly: AssemblyDescription("")> 
<Assembly: AssemblyCompany("$registeredorganization$")> 
<Assembly: AssemblyProduct("$projectname$")> 
<Assembly: AssemblyCopyright("Copyright © $registeredorganization$ $year$")> 
<Assembly: AssemblyTrademark("")> 

<Assembly: ComVisible(False)>

'Чтобы начать создание локализуемых приложений, задайте 
'<UICulture>код_языка_используемого_при_написании_кода</UICulture> в VBPROJ-файле
'в <PropertyGroup>. Например, при использовании английского (США) 
'в исходных файлах, присвойте параметру <UICulture> значение en-US. Затем раскомментируйте
'атрибут NeutralResourceLanguage, расположенный ниже. Обновите "en-US" в строке,
'расположенной ниже, чтобы сопоставить с параметром UICulture в файле проекта.

'<Assembly: NeutralResourcesLanguage("en-US", UltimateResourceFallbackLocation.Satellite)> 


'Атрибут ThemeInfo описывает, где можно найти любой универсальный или тематический словарь ресурсов.
'1-ый параметр: расположение тематических словарей ресурсов
'(используется, если на странице не найден ресурс, 
' или словари ресурсов приложения)

'2-ой параметр: расположение универсальных словарей ресурсов
'(используется, если на странице не найден ресурс, 
'приложение и любые тематические словари ресурсов)
<Assembly: ThemeInfo(ResourceDictionaryLocation.None, ResourceDictionaryLocation.SourceAssembly)>


'Указанный ниже идентификатор GUID предназначен для идентификации библиотеки типов, если этот проект будет видимым для COM-объектов
<Assembly: Guid("$guid1$")>

' Сведения о версии сборки состоят из указанных ниже четырех значений:
'
'      Основной номер версии
'      Дополнительный номер версии 
'      Номер сборки
'      Номер редакции
'
' Можно указать все значения или установить для номеров редакции и сборки значение по умолчанию 
' с помощью символа "*", как показано ниже:
' <Assembly: AssemblyVersion("1.0.*")> 

<Assembly: AssemblyVersion("1.0.0.0")> 
<Assembly: AssemblyFileVersion("1.0.0.0")> 
