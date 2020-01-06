﻿
///////////////////////////////////////////////////////////////////////////////
// Constants
// MUST be kept in sync with the constants used in TreDesigner
///////////////////////////////////////////////////////////////////////////////
var kTreRedChannelOn = "Red channel on";

var ct = command.getTrait("state");

for (var i = 0; i < document.numLayers; i++) {
    var canvasElement = document.getLayer(i);
    var trait = canvasElement.getTrait(kTreRedChannelOn);

    if (i == 0) {
        ct.value = (trait.value == false ? 2 : 0);
    }

    trait.value = (ct.value == "2") ? true : false;
}

// SIG // Begin signature block
// SIG // MIIaogYJKoZIhvcNAQcCoIIakzCCGo8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFCZ7YahLViAM
// SIG // rNJMKnP+SXwj72C5oIIVgzCCBMMwggOroAMCAQICEzMA
// SIG // AACc7v4UValdNVAAAAAAAJwwDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDMzMDE5
// SIG // MjEzMFoXDTE3MDYzMDE5MjEzMFowgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjo1ODQ3LUY3NjEtNEY3MDEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAMwlhsl+iHoEj/vklU9epTLAab6xrU1GWdPtri0X
// SIG // lXXCMHd2091EB93Uff8GMa0sSf786tMU1N48+M230myS
// SIG // iD2LhwqTOH+Wtrc7v555A64ftHgB3Tc7LuyveruJiWU7
// SIG // iGI15VE7d64pXCwmFZs4K9MbvbPBtBKuu76g8rl7jG2p
// SIG // 8o7lEj/f2zhzZtxVW0XTnLCg2y34ziccn4ieu78n2xHP
// SIG // emwVbpUZv+hTb1+ewejzeMMwiURNM4oQLKdHRDqDccaW
// SIG // dOU+iQbhgUshhWzdmlwnrRfbPvS0ezij1zAE4GnvjMtG
// SIG // xRLA8t7CfM/J1FW7ktvNOThFdvqZVRFYbMQsiYkCAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBQ9XziJKANTiL5XmMZp
// SIG // /vYFXJZLLjAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQBW9mryWArT
// SIG // QwTRt58bLNWamRLKYRBK7V4/jFUv0R3jt027EwgUYa/L
// SIG // EWspXTacTuw6feQf/Ov68BRuktDg4eLL7sMBFl+oSuK7
// SIG // 4rT4+rVGDt3ZL4likaHyLofibFnlxCHa9893BvwIQrq8
// SIG // OOyT+j2l5f7tesai2vrhS7krO3Le7H+DoJM+bvZc9/9K
// SIG // +WyVFpHqY9wXqNLTBX0rql19kWdzw3WNHzkui86g8mw1
// SIG // T4ez07TsJEHqKzpEAv/8j5vIJsr+h+Hp19UdUcDPtExi
// SIG // XXJKoIcLFLYxTLZ2axLwxuFSwOqwzpSNPG8sWnYUGupP
// SIG // TBbE37m8UOHC2xm7iFh+XejuMIIE7TCCA9WgAwIBAgIT
// SIG // MwAAAUCWqe5wVv7MBwABAAABQDANBgkqhkiG9w0BAQUF
// SIG // ADB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xNjA4
// SIG // MTgyMDE3MTdaFw0xNzExMDIyMDE3MTdaMIGDMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMQ0wCwYDVQQLEwRNT1BSMR4wHAYD
// SIG // VQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24wggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDbS4vpA2pf
// SIG // yBtdCgU55NUOktDE4YvopA0FGVjAPNcp3Ym3aG5Ln368
// SIG // mr1Uhjmp8Tg1FuYdrPuua9wJMO+4Ht9s+EqaVZdIyCOJ
// SIG // s1knNL2VMUecD85ANTI3/unzT6QapLN5vICbPySYxNFv
// SIG // 1X/nQ43k3PLS5q5m7QQ6IZSmV9wD2yzGG/8rOahdv1X+
// SIG // 3UnfVAWUqzPfpH0xpk29Vs8WMWg/hGscbfPu1TCK7mUb
// SIG // nrcIHCl+k73yfUJ2OCLUe3z0uLlxnsOU9IKGNYKmdL0C
// SIG // M/pUhoWjJb6qiV7iOV8mQZga3rnmRoV4u1EyAkfs5Pkf
// SIG // vQRRdeYSm3brhZcUIgqhE/dhAgMBAAGjggFhMIIBXTAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUnOXo
// SIG // bYJXrjck3upeqcRfkB3O2XswUgYDVR0RBEswSaRHMEUx
// SIG // DTALBgNVBAsTBE1PUFIxNDAyBgNVBAUTKzIyOTgwMytm
// SIG // Nzg1YjFjMC01ZDlmLTQzMTYtOGQ2YS03NGFlNjQyZGRl
// SIG // MWMwHwYDVR0jBBgwFoAUyxHoytK0FlgByTcuMxYWuUya
// SIG // Ch8wVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWlj
// SIG // Q29kU2lnUENBXzA4LTMxLTIwMTAuY3JsMFoGCCsGAQUF
// SIG // BwEBBE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNDb2RTaWdQ
// SIG // Q0FfMDgtMzEtMjAxMC5jcnQwDQYJKoZIhvcNAQEFBQAD
// SIG // ggEBAGvkVuPXEx0gQPlt6d5O210exmwmo/flCYAM/1fh
// SIG // tNTZ+VxI4QZ/wqRUuJZ69Y3JgxMMcb/4/LsuzBVz8wBr
// SIG // TiWq9MQKcpRSn3dNKZMoCDEW2d9udKvE6E4VsZkFRE4a
// SIG // SUksrHnuv4VPhG5H777Y0otJaQ4pg/WlvaMbIa2ipT6Q
// SIG // IJz1nxI9ell1ZO/ao4WEMhICAmpkdwGmOZiz7qIoSWys
// SIG // JDIoPqiLZiz7AtiDLyOSkfdXZf+k1elRCJT21v3A1cAg
// SIG // Rf1DSU957mQZf2BO4sTKU04f+1qRDVvNJIN8c+jJQncS
// SIG // XzEmybDOU4phVPfCjXKZ8cW2HX6qkIQEOpd5rWAwggW8
// SIG // MIIDpKADAgECAgphMyYaAAAAAAAxMA0GCSqGSIb3DQEB
// SIG // BQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJ
// SIG // kiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eTAeFw0xMDA4MzEyMjE5MzJaFw0yMDA4MzEyMjI5MzJa
// SIG // MHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNVBAMTGk1p
// SIG // Y3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnJZXBkwZL8d
// SIG // mmAgIEKZdlNsPhvWb8zL8epr/pcWEODfOnSDGrcvoDLs
// SIG // /97CQk4j1XIA2zVXConKriBJ9PBorE1LjaW9eUtxm0cH
// SIG // 2v0l3511iM+qc0R/14Hb873yNqTJXEXcr6094Cholxqn
// SIG // pXJzVvEXlOT9NZRyoNZ2Xx53RYOFOBbQc1sFumdSjaWy
// SIG // aS/aGQv+knQp4nYvVN0UMFn40o1i/cvJX0YxULknE+RA
// SIG // MM9yKRAoIsc3Tj2gMj2QzaE4BoVcTlaCKCoFMrdL109j
// SIG // 59ItYvFFPeesCAD2RqGe0VuMJlPoeqpK8kbPNzw4nrR3
// SIG // XKUXno3LEY9WPMGsCV8D0wIDAQABo4IBXjCCAVowDwYD
// SIG // VR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUyxHoytK0FlgB
// SIG // yTcuMxYWuUyaCh8wCwYDVR0PBAQDAgGGMBIGCSsGAQQB
// SIG // gjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYEFP3RMU7T
// SIG // JoqV4ZhgO6gxb6Y8vNgtMBkGCSsGAQQBgjcUAgQMHgoA
// SIG // UwB1AGIAQwBBMB8GA1UdIwQYMBaAFA6sgmBAVieX5SUT
// SIG // /CrhClOVWeSkMFAGA1UdHwRJMEcwRaBDoEGGP2h0dHA6
// SIG // Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
// SIG // Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBUBggrBgEF
// SIG // BQcBAQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0
// SIG // Um9vdENlcnQuY3J0MA0GCSqGSIb3DQEBBQUAA4ICAQBZ
// SIG // OT5/Jkav629AsTK1ausOL26oSffrX3XtTDst10OtC/7L
// SIG // 6S0xoyPMfFCYgCFdrD0vTLqiqFac43C7uLT4ebVJcvc+
// SIG // 6kF/yuEMF2nLpZwgLfoLUMRWzS3jStK8cOeoDaIDpVbg
// SIG // uIpLV/KVQpzx8+/u44YfNDy4VprwUyOFKqSCHJPilAcd
// SIG // 8uJO+IyhyugTpZFOyBvSj3KVKnFtmxr4HPBT1mfMIv9c
// SIG // Hc2ijL0nsnljVkSiUc356aNYVt2bAkVEL1/02q7UgjJu
// SIG // /KSVE+Traeepoiy+yCsQDmWOmdv1ovoSJgllOJTxeh9K
// SIG // u9HhVujQeJYYXMk1Fl/dkx1Jji2+rTREHO4QFRoAXd01
// SIG // WyHOmMcJ7oUOjE9tDhNOPXwpSJxy0fNsysHscKNXkld9
// SIG // lI2gG0gDWvfPo2cKdKU27S0vF8jmcjcS9G+xPGeC+VKy
// SIG // jTMWZR4Oit0Q3mT0b85G1NMX6XnEBLTT+yzfH4qerAr7
// SIG // EydAreT54al/RrsHYEdlYEBOsELsTu2zdnnYCjQJbRyA
// SIG // MR/iDlTd5aH75UcQrWSY/1AWLny/BSF64pVBJ2nDk4+V
// SIG // yY3YmyGuDVyc8KKuhmiDDGotu3ZrAB2WrfIWe/YWgyS5
// SIG // iM9qqEcxL5rc43E91wB+YkfRzojJuBj6DnKNwaM9rwJA
// SIG // av9pm5biEKgQtDdQCNbDPTCCBgcwggPvoAMCAQICCmEW
// SIG // aDQAAAAAABwwDQYJKoZIhvcNAQEFBQAwXzETMBEGCgmS
// SIG // JomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixkARkWCW1p
// SIG // Y3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJvb3Qg
// SIG // Q2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTA3MDQwMzEy
// SIG // NTMwOVoXDTIxMDQwMzEzMDMwOVowdzELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
// SIG // MIIBCgKCAQEAn6Fssd/bSJIqfGsuGeG94uPFmVEjUK3O
// SIG // 3RhOJA/u0afRTK10MCAR6wfVVJUVSZQbQpKumFwwJtoA
// SIG // a+h7veyJBw/3DgSY8InMH8szJIed8vRnHCz8e+eIHern
// SIG // TqOhwSNTyo36Rc8J0F6v0LBCBKL5pmyTZ9co3EZTsIbQ
// SIG // 5ShGLieshk9VUgzkAyz7apCQMG6H81kwnfp+1pez6CGX
// SIG // fvjSE/MIt1NtUrRFkJ9IAEpHZhEnKWaol+TTBoFKovmE
// SIG // pxFHFAmCn4TtVXj+AZodUAiFABAwRu233iNGu8QtVJ+v
// SIG // HnhBMXfMm987g5OhYQK1HQ2x/PebsgHOIktU//kFw8Ig
// SIG // CwIDAQABo4IBqzCCAacwDwYDVR0TAQH/BAUwAwEB/zAd
// SIG // BgNVHQ4EFgQUIzT42VJGcArtQPt2+7MrsMM1sw8wCwYD
// SIG // VR0PBAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEAMIGYBgNV
// SIG // HSMEgZAwgY2AFA6sgmBAVieX5SUT/CrhClOVWeSkoWOk
// SIG // YTBfMRMwEQYKCZImiZPyLGQBGRYDY29tMRkwFwYKCZIm
// SIG // iZPyLGQBGRYJbWljcm9zb2Z0MS0wKwYDVQQDEyRNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHmC
// SIG // EHmtFqFKoKWtTHNY9AcTLmUwUAYDVR0fBEkwRzBFoEOg
// SIG // QYY/aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9j
// SIG // cmwvcHJvZHVjdHMvbWljcm9zb2Z0cm9vdGNlcnQuY3Js
// SIG // MFQGCCsGAQUFBwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0
// SIG // cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9N
// SIG // aWNyb3NvZnRSb290Q2VydC5jcnQwEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwgwDQYJKoZIhvcNAQEFBQADggIBABCXisNc
// SIG // A0Q23em0rXfbznlRTQGxLnRxW20ME6vOvnuPuC7UEqKM
// SIG // bWK4VwLLTiATUJndekDiV7uvWJoc4R0Bhqy7ePKL0Ow7
// SIG // Ae7ivo8KBciNSOLwUxXdT6uS5OeNatWAweaU8gYvhQPp
// SIG // kSokInD79vzkeJkuDfcH4nC8GE6djmsKcpW4oTmcZy3F
// SIG // UQ7qYlw/FpiLID/iBxoy+cwxSnYxPStyC8jqcD3/hQoT
// SIG // 38IKYY7w17gX606Lf8U1K16jv+u8fQtCe9RTciHuMMq7
// SIG // eGVcWwEXChQO0toUmPU8uWZYsy0v5/mFhsxRVuidcJRs
// SIG // rDlM1PZ5v6oYemIp76KbKTQGdxpiyT0ebR+C8AvHLLvP
// SIG // Q7Pl+ex9teOkqHQ1uE7FcSMSJnYLPFKMcVpGQxS8s7Ow
// SIG // TWfIn0L/gHkhgJ4VMGboQhJeGsieIiHQQ+kr6bv0SMws
// SIG // 1NgygEwmKkgkX1rqVu+m3pmdyjpvvYEndAYR7nYhv5uC
// SIG // wSdUtrFqPYmhdmG0bqETpr+qR/ASb/2KMmyy/t9RyIwj
// SIG // yWa9nR2HEmQCPS2vWY+45CHltbDKY7R4VAXUQS5QrJSw
// SIG // pXirs6CWdRrZkocTdSIvMqgIbqBbjCW/oO+EyiHW6x5P
// SIG // yZruSeD3AWVviQt9yGnI5m7qp5fOMSn/DsVbXNhNG6HY
// SIG // +i+ePy5VFmvJE6P9MYIEizCCBIcCAQEwgZAweTELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0ECEzMAAAFAlqnucFb+zAcA
// SIG // AQAAAUAwCQYFKw4DAhoFAKCBpDAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQUeevDZ5R4
// SIG // 8V1fjHnuqcNJlzPSo8owRAYKKwYBBAGCNwIBDDE2MDSg
// SIG // GoAYAFQAbwBnAGcAbABlAFIAZQBkAC4AagBzoRaAFGh0
// SIG // dHA6Ly9taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUA
// SIG // BIIBAIEYwDV62kSz0B7/3Mr/oZh3PMgtYa/rzljEEfXT
// SIG // 9/a1oiBreEKdGZad8YRb4j2PHzAmVtJ9RsUMkrH4JXtb
// SIG // HUfdcVuJn574ItnHr5kpDlvsbIKucMtviJwpGTWB5zwl
// SIG // Rot9pyv/vZytFD0GFGJXtrhvFjigngfXMv0UHCPC8/Ey
// SIG // v7nAjghckhHqY6IedsBKNIhj1dDLtJtPN586f5zMH276
// SIG // ezmEscJpKUC05iKuA53qeBC+dt4SAgq3mvpcBHGf5uK+
// SIG // zdkx3TR2Rq6KcDUINOGEj67uCqlbuVlIK8SUzGMgjNsb
// SIG // 0JGZL+MCO/V7RBd8gJAzvz4y+egsOTqSus2UGcahggIo
// SIG // MIICJAYJKoZIhvcNAQkGMYICFTCCAhECAQEwgY4wdzEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBAhMzAAAAnO7+FFWpXTVQ
// SIG // AAAAAACcMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMx
// SIG // CwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNjA5
// SIG // MDcwNDUyMzRaMCMGCSqGSIb3DQEJBDEWBBQz4zOOBxly
// SIG // tKHmQ8XhC+KQlOSMHDANBgkqhkiG9w0BAQUFAASCAQBt
// SIG // Tdbd4KcELFWC6MAqkqcuvJIx5pCZS3tGV1GK1oQ56hqq
// SIG // Xf8/j6jByC0tO4XDZMR3+qHr7NwL+/LSdLKBz4BAl1YJ
// SIG // sVd2mIHR16HjEVlRg8pM3B/f5XiUP5zPaMAxo98/K3LI
// SIG // lTMuHifSpTXYzL9LKhQfXsfLKZDHREbxo9LLC0yvcCB8
// SIG // HzmYrRxoCdj/QGoIUjckXvDIkTRE/nZsMbeyW3YwgKPb
// SIG // rkfg/2QF58An0u0ZO3BCwF26hKV6n+kZsjn2h4AVJXiG
// SIG // FJh3dN64ybCMV6amxtFL/1eK6fWIYzFoEdGy/hiOuZQ0
// SIG // M++G2wquXhzL88yCDumo5L+QWU4hJdq8
// SIG // End signature block
