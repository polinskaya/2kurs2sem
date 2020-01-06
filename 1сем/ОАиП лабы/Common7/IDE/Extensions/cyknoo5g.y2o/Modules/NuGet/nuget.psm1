# make sure we stop on exceptions
$ErrorActionPreference = "Stop"

# This object reprents the result value for tab expansion functions when no result is returned.
# This is so that we can distinguish it from $null, which has different semantics
$NoResultValue = New-Object PSObject -Property @{ NoResult = $true }

# Hashtable that stores tab expansion definitions
$TabExpansionCommands = New-Object 'System.Collections.Hashtable' -ArgumentList @([System.StringComparer]::InvariantCultureIgnoreCase)

function Register-TabExpansion {
<#
.SYNOPSIS
    Registers a tab expansion for the parameters of the specified command.
.DESCRIPTION
    Registers a tab expansion for the parameters of the specified command.
.PARAMETER Name
    Name of the command the expansion is for.
.EXAMPLE
    PS> Register-TabExpansion 'Set-Color', @{'color' = {'blue', 'green', 'red'}}
         This adds a tab expansion to the Set-Color command. Set-Color contains a single 
         parameter, color, with three possible expansion values.
#>
    [CmdletBinding()]
    param(
        [parameter(Mandatory = $true)]
        [string]$Name,
        [parameter(Mandatory = $true)]
        $Definition
    )

    # transfer $definition data into a new hashtable that compare values using InvariantCultureIgnoreCase
    $normalizedDefinition = New-Object 'System.Collections.Hashtable' -ArgumentList @([System.StringComparer]::InvariantCultureIgnoreCase)
    $definition.GetEnumerator() | % { $normalizedDefinition[$_.Name] = $_.Value }
        
    $TabExpansionCommands[$Name] = $normalizedDefinition
}

Register-TabExpansion 'Get-Package' @{
    'Source' = {
        GetPackageSources
    }
    'ProjectName' = {
        GetProjectNames
    }
}

Register-TabExpansion 'Install-Package' @{
    'Id' = {
        param($context)
        GetRemotePackageIds $context
    }
    'ProjectName' = {
        GetProjectNames
    }
    'Version' = {
        param($context)
        GetRemotePackageVersions $context
    }
    'Source' = {
        GetPackageSources
    }
	'DependencyVersion' = {
		GetEnumNames 'NuGet.Resolver.DependencyBehavior'
	}
	'FileConflictAction' = {
		GetEnumNames 'NuGet.ProjectManagement.FileConflictAction'
	}
}

Register-TabExpansion 'Uninstall-Package' @{
    'Id' = {
        param($context)
        GetInstalledPackageIds $context
    }
    'ProjectName' = {
        GetProjectNames
    }
    'Version' = {
        GetInstalledPackageVersions $context
    }
}

Register-TabExpansion 'Update-Package' @{
    'Id' = {
        param($context)
        GetInstalledPackageIds $context
    }
    'ProjectName' = {
        GetProjectNames
    }
    'Version' = {
        param($context)

        # Only show available versions if an id was specified
        if ($context.id) { 
            # Find the installed package (this might be nothing since we could have a partial id)
            $versions = @()
            $packages = @(Get-Package $context.id | ? { $_.Id -eq $context.id })

            if($packages.Count) {
                $package = @($packages | Sort-Object Version)[0]

                $versions = GetRemotePackageUpdateVersions $context
            }

            $versions
        }
    }
    'Source' = {
        GetPackageSources
    }
	'FileConflictAction' = {
		GetEnumNames 'NuGet.ProjectManagement.FileConflictAction'
	}
}

Register-TabExpansion 'Open-PackagePage' @{
    'Id' = {
        param($context)
        GetRemotePackageIds $context
    }
    'Version' = {
        param($context)
        GetRemotePackageVersions $context
    }
    'Source' = {
        GetPackageSources
    }
}

Register-TabExpansion 'Add-BindingRedirect' @{ 'ProjectName' = { GetProjectNames } }
Register-TabExpansion 'Get-Project' @{ 'Name' = { GetProjectNames } }

function HasProperty($context, $name) {
    return $context.psobject.properties | ? { $_.Name -eq $name }
}

function IsPrereleaseSet($context) {
	# Need to figure out a better way to do this. 
	return (HasProperty $context 'IncludePreRelease') -or (HasProperty $context 'PreRelease') -or (HasProperty $context 'Pre')
}

function GetPackages($context) {
    $parameters = @{}

    if ($context.Id) { $parameters.Id = $context.Id }
    if ($context.Source) { $parameters.source = $context.Source }
    if (IsPrereleaseSet $context) {
        $parameters.IncludePreRelease = $true 
    }

    # StartWith switch is implicity set for TabExpansion command
    return TabExpansion-Package @parameters -ExcludeVersionInfo
}

function GetProjectNames {
    $uniqueNames = @(Get-Project -All | Select-Object -ExpandProperty ProjectName)
    
    $simpleNames = Get-Project -All | Select-Object -ExpandProperty Name
    $safeNames = @($simpleNames | Group-Object | Where-Object { $_.Count -eq 1 } | Select-Object -ExpandProperty Name)

    ($uniqueNames + $safeNames) | Select-Object -Unique | Sort-Object
}

function GetInstalledPackageIds($context) {
    $parameters = @{}
    
    if ($context.Id) { $parameters.filter = $context.id }

    Get-Package @parameters -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id -Unique
}

function GetRemotePackageIds($context) {
    $parameters = @{}

    if ($context.Id) { $parameters.filter = $context.Id }
    if ($context.Source) { $parameters.source = $context.Source }
    if (IsPrereleaseSet $context) {
        $parameters.IncludePrerelease = $true 
    }

    try {
		return Get-RemotePackageId @parameters
    }
    catch {
        # If the server doesn't have the JSON API endpoints, get the remote package IDs the old way.
        return GetPackages $context | Select-Object -ExpandProperty Id -Unique
    }
}

function GetPackageSources() {
    $componentModel = Get-VSComponentModel
    $repositoryProvider = $componentModel.GetService([NuGet.Protocol.Core.Types.ISourceRepositoryProvider])
    $allSources = $repositoryProvider.PackageSourceProvider.LoadPackageSources()
    $allSources | Select-Object -ExpandProperty Name
}

function GetEnumNames($typeName) {
	# Sort the enumerations in alphabetical order to make it consistent with TabExpansion2
    return [System.Enum]::GetNames($typeName) | Sort-Object
}

function GetInstalledPackageVersions($context) {
    $parameters = @{}
    if ($context.id) { $parameters.Filter = $context.id }
    GetAndSortVersions (Get-Package @parameters -ErrorAction SilentlyContinue)
}

function GetRemotePackageVersions($context) {
    $parameters = @{}

    if ($context.Id -eq $null) {
        return @()
    }

    if ($context.Id) { $parameters.id = $context.Id }
    if ($context.Source) { $parameters.source = $context.Source }
    if (IsPrereleaseSet $context) {
        $parameters.IncludePreRelease = $true 
    }

    try {
	    return Get-RemotePackageVersion @parameters | %{ [NuGet.SemanticVersion]::Parse($_) } | Sort-Object -Descending
    }
    catch {
	    # If the server doesn't have the JSON API endpoints, get the remote package versions the old way.
        $parameters = @{}
        if ($context.Id) { $parameters.Id = $context.Id }
        if ($context.Source) { $parameters.source = $context.Source }
        if (IsPrereleaseSet $context) {
            $parameters.IncludePreRelease = $true 
        }
        $parameters.AllVersions = $true
        # StartWith switch is implicity set for TabExpansion command
        GetAndSortVersions(TabExpansion-Package @parameters -ExactMatch -ErrorAction SilentlyContinue)
    }
}

function GetRemotePackageUpdateVersions($context) {
    $parameters = @{}

    if ($context.Id -eq $null) {
        return @()
    }

    if ($context.Id) { $parameters.id = $context.Id }
    if ($context.Source) { $parameters.source = $context.Source }
    if (IsPrereleaseSet $context) {
        $parameters.IncludePreRelease = $true 
    }

    try {
	    return Get-RemotePackageVersion @parameters | %{ [NuGet.SemanticVersion]::Parse($_) } | Sort-Object -Descending
    }
    catch {
	    # If the server doesn't have the JSON API endpoints, get the remote package versions the old way.
        $parameters = @{}
        if ($context.Id) { $parameters.Filter = $context.Id }
        if ($context.Source) { $parameters.source = $context.Source }
        if (IsPrereleaseSet $context) {
            $parameters.IncludePreRelease = $true 
        }
        $parameters.Updates = $true
        GetAndSortVersions(Get-Package @parameters -AllVersions -ErrorAction SilentlyContinue)
    }
}

function GetAndSortVersions($packages) {
    $packages | Select -Unique -ExpandProperty Versions | %{
        if($_ -is [string]) { 
            [NuGet.SemanticVersion]::Parse($_) 
        } else { 
            $_ 
        }  
    } | Sort-Object -Descending
}

function NugetTabExpansion($line, $lastWord) {
    # Parse the command
    $parsedCommand = [NuGetConsole.Host.PowerShell.CommandParser]::Parse($line)

    # Get the command definition
    $definition = $TabExpansionCommands[$parsedCommand.CommandName]

    # See if we've registered a command for intellisense
    if($definition) {
        # Get the command that we're trying to show intellisense for
        $command = Get-Command $parsedCommand.CommandName -ErrorAction SilentlyContinue

        if($command) {            
            # We're trying to find out what parameter we're trying to show intellisense for based on 
            # either the name of the an argument or index e.g. "Install-Package -Id " "Install-Package "
            
            $argument = $parsedCommand.CompletionArgument
            $index = $parsedCommand.CompletionIndex

            if(!$argument -and $index -ne $null) {                
                do {
                    # Get the argument name for this index
                    $argument = GetArgumentName $command $index

                    if(!$argument) {
                        break
                    }
                    
                    # If there is already a value for this argument, then check the next one index.
                    # This is so we don't show duplicate intellisense e.g. "Install-Package -Id elmah {tab}".
                    # The above statement shouldn't show intellisense for id since it already has a value
                    if($parsedCommand.Arguments[$argument] -eq $null) {
                        $value = $parsedCommand.Arguments[$index]

                        if(!$value) {
                            $value = ''
                        }
                        $parsedCommand.Arguments[$argument] = $value
                        break
                    }
                    else {
                        $index++
                    }

                } while($true);    
            }

            if($argument) {
                # Populate the arguments dictionary with the name and value of the 
                # associated index. i.e. for the command "Install-Package elmah" arguments should have
                # an entries with { 0, "elmah" } and { "Id", "elmah" }
                $arguments = New-Object 'System.Collections.Hashtable' -ArgumentList @([System.StringComparer]::InvariantCultureIgnoreCase)

                $parsedCommand.Arguments.Keys | Where-Object { $_ -is [int] } | %{
                    $argName = GetArgumentName $command $_
                    $arguments[$argName] = $parsedCommand.Arguments[$_]
                }

                # Copy the arguments over to the parsed command arguments
                $arguments.Keys | %{ 
                    $parsedCommand.Arguments[$_] = $arguments[$_]
                }

                # If the argument is a true argument of this command and not a partial argument
                # and there is a non null value (empty is valid), then we execute the script block
                # for this parameter (if specified)
                $action = $definition[$argument]
                $argumentValue = $parsedCommand.Arguments[$argument]

                if($command.Parameters[$argument] -and 
                   $argumentValue -ne $null -and
                   $action) {
                    $context = New-Object PSObject -Property $parsedCommand.Arguments
                    
                    $results = @(& $action $context)

                    if($results.Count -eq 0) {
                        return $null
                    }

                    # Use the argument value to filter results
                    $results = $results | %{ $_.ToString() } | Where-Object { $_.StartsWith($argumentValue, "OrdinalIgnoreCase") }

                    return NormalizeResults $results
                }
            }
        }
    } 

    return $NoResultValue
}

function NormalizeResults($results) {
    $results | %{
        $result = $_

        # Add quotes to a result if it contains whitespace or a quote
        $addQuotes = $result.Contains(" ") -or $result.Contains("'") -or $result.Contains("`t")
        
        if($addQuotes) {
            $result = "'" + $result.Replace("'", "''") + "'"
        }

        return $result
    }
}

function GetArgumentName($command, $index) {    
    # Next we try to find the parameter name for the parameter index (in the default parameter set)
    $parameterSet = $Command.DefaultParameterSet

    if(!$parameterSet) {
        $parameterSet = '__AllParameterSets'
    }

    return $command.Parameters.Values | ?{ $_.ParameterSets[$parameterSet].Position -eq $index } | Select -ExpandProperty Name
}

function Format-ProjectName {
    param(
        [parameter(position=0, mandatory=$true)]
        [validatenotnull()]
        $Project,
        [parameter(position=1, mandatory=$true)]
        [validaterange(6, 1000)]
        [int]$ColWidth
    )
    
	return $project.name
}
# SIG # Begin signature block
# MIIdpAYJKoZIhvcNAQcCoIIdlTCCHZECAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQUE/4by+jkiZrkDy14gtDrzZkn
# ZaOgghhkMIIEwzCCA6ugAwIBAgITMwAAAJmqxYGfjKJ9igAAAAAAmTANBgkqhkiG
# 9w0BAQUFADB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEw
# HwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EwHhcNMTYwMzMwMTkyMTI4
# WhcNMTcwNjMwMTkyMTI4WjCBszELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjENMAsGA1UECxMETU9QUjEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNO
# Ojk4RkQtQzYxRS1FNjQxMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
# ZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAipCth86FRu1y
# rtsPu2NLSV7nv6A/oVAcvGrG7VQwRn+wGlXrBf4nyiybHGn9MxuB9u4EMvH8s75d
# kt73WT7lGIT1yCIh9VC9ds1iWfmxHZtYutUOM92+a22ukQW00T8U2yowZ6Gav4Q7
# +9M1UrPniZXDwM3Wqm0wkklmwfgEEm+yyCbMkNRFSCG9PIzZqm6CuBvdji9nMvfu
# TlqxaWbaFgVRaglhz+/eLJT1e45AsGni9XkjKL6VJrabxRAYzEMw4qSWshoHsEh2
# PD1iuKjLvYspWv4EBCQPPIOpGYOxpMWRq0t/gqC+oJnXgHw6D5fZ2Ccqmu4/u3cN
# /aAt+9uw4wIDAQABo4IBCTCCAQUwHQYDVR0OBBYEFHbWEvi6BVbwsceywvljICto
# twQRMB8GA1UdIwQYMBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMPMFQGA1UdHwRNMEsw
# SaBHoEWGQ2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3Rz
# L01pY3Jvc29mdFRpbWVTdGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEETDBKMEgGCCsG
# AQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jv
# c29mdFRpbWVTdGFtcFBDQS5jcnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZI
# hvcNAQEFBQADggEBABbNYMMt3JjfMAntjQhHrOz4aUk970f/hJw1jLfYspFpq+Gk
# W3jMkUu3Gev/PjRlr/rDseFIMXEq2tEf/yp72el6cglFB1/cbfDcdimLQD6WPZQy
# AfrpEccCLaouf7mz9DGQ0b9C+ha93XZonTwPqWmp5dc+YiTpeAKc1vao0+ru/fuZ
# ROex8Zd99r6eoZx0tUIxaA5sTWMW6Y+05vZN3Ok8/+hwqMlwgNR/NnVAOg2isk9w
# ox9S1oyY9aRza1jI46fbmC88z944ECfLr9gja3UKRMkB3P246ltsiH1fz0kFAq/l
# 2eurmfoEnhg8n3OHY5a/Zzo0+W9s1ylfUecoZ4UwggYHMIID76ADAgECAgphFmg0
# AAAAAAAcMA0GCSqGSIb3DQEBBQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAX
# BgoJkiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290
# IENlcnRpZmljYXRlIEF1dGhvcml0eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0MDMx
# MzAzMDlaMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
# BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ+hbLHf20iSKnxrLhnhveLjxZlRI1Ctzt0YTiQP7tGn
# 0UytdDAgEesH1VSVFUmUG0KSrphcMCbaAGvoe73siQcP9w4EmPCJzB/LMySHnfL0
# Zxws/HvniB3q506jocEjU8qN+kXPCdBer9CwQgSi+aZsk2fXKNxGU7CG0OUoRi4n
# rIZPVVIM5AMs+2qQkDBuh/NZMJ36ftaXs+ghl3740hPzCLdTbVK0RZCfSABKR2YR
# JylmqJfk0waBSqL5hKcRRxQJgp+E7VV4/gGaHVAIhQAQMEbtt94jRrvELVSfrx54
# QTF3zJvfO4OToWECtR0Nsfz3m7IBziJLVP/5BcPCIAsCAwEAAaOCAaswggGnMA8G
# A1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0+NlSRnAK7UD7dvuzK7DDNbMPMAsG
# A1UdDwQEAwIBhjAQBgkrBgEEAYI3FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQOrIJg
# QFYnl+UlE/wq4QpTlVnkpKFjpGEwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcG
# CgmSJomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJvb3Qg
# Q2VydGlmaWNhdGUgQXV0aG9yaXR5ghB5rRahSqClrUxzWPQHEy5lMFAGA1UdHwRJ
# MEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
# Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYIKwYB
# BQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9z
# b2Z0Um9vdENlcnQuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# BQUAA4ICAQAQl4rDXANENt3ptK132855UU0BsS50cVttDBOrzr57j7gu1BKijG1i
# uFcCy04gE1CZ3XpA4le7r1iaHOEdAYasu3jyi9DsOwHu4r6PCgXIjUji8FMV3U+r
# kuTnjWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZLg33B+JwvBhOnY5rCnKVuKE5nGct
# xVEO6mJcPxaYiyA/4gcaMvnMMUp2MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tOi3/F
# NSteo7/rvH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLaFJj1PLlmWLMtL+f5hYbMUVbo
# nXCUbKw5TNT2eb+qGHpiKe+imyk0BncaYsk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0
# NbhOxXEjEiZ2CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCeFTBm6EISXhrIniIh0EPp
# K+m79EjMLNTYMoBMJipIJF9a6lbvpt6Znco6b72BJ3QGEe52Ib+bgsEnVLaxaj2J
# oXZhtG6hE6a/qkfwEm/9ijJssv7fUciMI8lmvZ0dhxJkAj0tr1mPuOQh5bWwymO0
# eFQF1EEuUKyUsKV4q7OglnUa2ZKHE3UiLzKoCG6gW4wlv6DvhMoh1useT8ma7kng
# 9wFlb4kLfchpyOZu6qeXzjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TCCBhAwggP4
# oAMCAQICEzMAAABkR4SUhttBGTgAAAAAAGQwDQYJKoZIhvcNAQELBQAwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMTAeFw0xNTEwMjgyMDMxNDZaFw0xNzAx
# MjgyMDMxNDZaMIGDMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
# MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
# MQ0wCwYDVQQLEwRNT1BSMR4wHAYDVQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24w
# ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCTLtrY5j6Y2RsPZF9NqFhN
# FDv3eoT8PBExOu+JwkotQaVIXd0Snu+rZig01X0qVXtMTYrywPGy01IVi7azCLiL
# UAvdf/tqCaDcZwTE8d+8dRggQL54LJlW3e71Lt0+QvlaHzCuARSKsIK1UaDibWX+
# 9xgKjTBtTTqnxfM2Le5fLKCSALEcTOLL9/8kJX/Xj8Ddl27Oshe2xxxEpyTKfoHm
# 5jG5FtldPtFo7r7NSNCGLK7cDiHBwIrD7huTWRP2xjuAchiIU/urvzA+oHe9Uoi/
# etjosJOtoRuM1H6mEFAQvuHIHGT6hy77xEdmFsCEezavX7qFRGwCDy3gsA4boj4l
# AgMBAAGjggF/MIIBezAfBgNVHSUEGDAWBggrBgEFBQcDAwYKKwYBBAGCN0wIATAd
# BgNVHQ4EFgQUWFZxBPC9uzP1g2jM54BG91ev0iIwUQYDVR0RBEowSKRGMEQxDTAL
# BgNVBAsTBE1PUFIxMzAxBgNVBAUTKjMxNjQyKzQ5ZThjM2YzLTIzNTktNDdmNi1h
# M2JlLTZjOGM0NzUxYzRiNjAfBgNVHSMEGDAWgBRIbmTlUAXTgqoXNzcitW2oynUC
# lTBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
# b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDctMDguY3JsMGEGCCsGAQUF
# BwEBBFUwUzBRBggrBgEFBQcwAoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
# aW9wcy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDctMDguY3J0MAwGA1Ud
# EwEB/wQCMAAwDQYJKoZIhvcNAQELBQADggIBAIjiDGRDHd1crow7hSS1nUDWvWas
# W1c12fToOsBFmRBN27SQ5Mt2UYEJ8LOTTfT1EuS9SCcUqm8t12uD1ManefzTJRtG
# ynYCiDKuUFT6A/mCAcWLs2MYSmPlsf4UOwzD0/KAuDwl6WCy8FW53DVKBS3rbmdj
# vDW+vCT5wN3nxO8DIlAUBbXMn7TJKAH2W7a/CDQ0p607Ivt3F7cqhEtrO1Rypehh
# bkKQj4y/ebwc56qWHJ8VNjE8HlhfJAk8pAliHzML1v3QlctPutozuZD3jKAO4WaV
# qJn5BJRHddW6l0SeCuZmBQHmNfXcz4+XZW/s88VTfGWjdSGPXC26k0LzV6mjEaEn
# S1G4t0RqMP90JnTEieJ6xFcIpILgcIvcEydLBVe0iiP9AXKYVjAPn6wBm69FKCQr
# IPWsMDsw9wQjaL8GHk4wCj0CmnixHQanTj2hKRc2G9GL9q7tAbo0kFNIFs0EYkbx
# Cn7lBOEqhBSTyaPS6CvjJZGwD0lNuapXDu72y4Hk4pgExQ3iEv/Ij5oVWwT8okie
# +fFLNcnVgeRrjkANgwoAyX58t0iqbefHqsg3RGSgMBu9MABcZ6FQKwih3Tj0DVPc
# gnJQle3c6xN3dZpuEgFcgJh/EyDXSdppZzJR4+Bbf5XA/Rcsq7g7X7xl4bJoNKLf
# cafOabJhpxfcFOowMIIHejCCBWKgAwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0B
# AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAG
# A1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTEw
# HhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEwOTA5WjB+MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
# aWduaW5nIFBDQSAyMDExMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
# q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4BjgaBEm6f8MMHt03a8YS2Avw
# OMKZBrDIOdUBFDFC04kNeWSHfpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eW
# WcpgGgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpcoRb0RrrgOGSsbmQ1
# eKagYw8t00CT+OPeBw3VXHmlSSnnDb6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le
# 2O3tQ5GD2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLTswM9sbKvkjh+
# 0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOEy/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2
# zCcoOCWYOUo2z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8kA/DRelsv
# 1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL5zmhD+kjSbwYuER8ReTBw3J64HLn
# JN+/RpnF78IcV9uDjexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyimp31n
# gOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8HhhUSJxAlMxdSlQy90lfdu+Hgg
# WCwTXWCVmj5PM4TasIgX3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
# CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXTgqoXNzcitW2oynUClTAZ
# BgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/
# BAUwAwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx0SOJNDBaBgNVHR8E
# UzBRME+gTaBLhklodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9k
# dWN0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4GCCsGAQUFBwEB
# BFIwUDBOBggrBgEFBQcwAoZCaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
# ZXJ0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNVHSAEgZcw
# gZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEFBQcCARYzaHR0cDovL3d3dy5taWNy
# b3NvZnQuY29tL3BraW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUFBwIC
# MDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5AF8AcwB0AGEAdABlAG0AZQBu
# AHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
# mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np22O/IjWll11lhJB9i0ZQ
# VdgMknzSGksc8zxCi1LQsP1r4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQ
# dION9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWluWpiW5IP0wI/zRive
# /DvQvTXvbiWu5a8n7dDd8w6vmSiXmE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrC
# xq2u5bLZ2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNABQamASooPoI/
# E01mC8CzTfXhj38cbxV9Rad25UAqZaPDXVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ
# 7l1jQeNbB5yHPgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ahXJbYANah
# Rr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbSoqKfenoi+kiVH6v7RyOA9Z74v2u3
# S5fi63V4GuzqN5l5GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E90Z1W
# Tk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZOSEXAQsmbdlsKgEhr/Xmfwb1t
# bWrJUnMTDXpQzTGCBKowggSmAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
# EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
# ZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcg
# UENBIDIwMTECEzMAAABkR4SUhttBGTgAAAAAAGQwCQYFKw4DAhoFAKCBvjAZBgkq
# hkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGC
# NwIBFTAjBgkqhkiG9w0BCQQxFgQU/mjiIvxgxtvuo+CzQ4wAO5nn0MkwXgYKKwYB
# BAGCNwIBDDFQME6gNIAyAE0AaQBjAHIAbwBzAG8AZgB0ACAAUABhAGMAawBhAGcA
# ZQAgAE0AYQBuAGEAZwBlAHKhFoAUaHR0cDovL3d3dy5hc3AubmV0LyAwDQYJKoZI
# hvcNAQEBBQAEggEAh9AlD8OYhA4ABmhilfR3sgPpZn6NynADtYY+cHZmbjI8irb4
# mT0xyXaNvKs9cO9WUQGHqlprTqzAN/1osHhWLdz/tNSbiCc2dqOxOCQAtDb+VV2w
# uwX1VOK4y1HQWhrNu9xjD09JLq6VTdnOvpOB2MuZT4wv4lcOYyfysUByUY9nJyBG
# GAP5pnX/c3rPI26MjzKnaWRElRWENmwkvKPlngeYa+iXE7SrvwqPyLO7NURH9dZq
# uu1wbqa+sUnW2N5JjpasXU1sNIC64EC4J3bATchNaixZThXrNhBnwFtDhOKHZfER
# DuVezdXQ+gpcBsOw1OlylJMnh8ErI4RIcfKyoqGCAigwggIkBgkqhkiG9w0BCQYx
# ggIVMIICEQIBATCBjjB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECEzMAAACZqsWB
# n4yifYoAAAAAAJkwCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0B
# BwEwHAYJKoZIhvcNAQkFMQ8XDTE2MDUxOTE4NTAzOFowIwYJKoZIhvcNAQkEMRYE
# FBQSuYuHWhgINnB4EM04GxDl+IKFMA0GCSqGSIb3DQEBBQUABIIBACYQWQhzevSQ
# YW0OivmMZ9xBs3Y5NAvmTgQi7gWExM1SMISPQGh0mMVfgIM3qjtO8KfyxwqG0Ajx
# lCoQu8AFahekOn08NjFkIoPNw2lv8k9L0B+YDQtmqWDajRhtf1Gc+7Tt/ma8osh/
# moIqNkjQJW0iSmWz8KUGJpgTlNk+4ryi1Zb6kgi/eC9YmRXSsNUJOSqyNh/YVFCt
# tcMnAAZY3ebRxwa9K0hzyyj0xUnmTC18Vdgq3YKRKOKi6qc1aRMGb3gshpz0AWaM
# 3jUEZt7vBJFljnX48iNnwrmekeLqsTZ5cW/b3n9OovigtqgiW28+Dban8oP7xgs1
# Ou64v5/74PI=
# SIG # End signature block
