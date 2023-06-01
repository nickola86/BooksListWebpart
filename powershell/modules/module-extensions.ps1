function Exists-PnpSite {
    param (
        [Parameter(Mandatory=$True)]
        [string]$url
    )
    try{
        $status=Do-SPLogin($url)
        Return $status
    }Catch{
        Return $False
    }
}

function Exists-PnpField {
    param (
        [Parameter(Mandatory=$True)]
        [string]$objectName
    )
    try{
        Return (Get-PnPField -Identity $objectName 2>$null) -ne $null
    }Catch {
        Return $False
    }
}
function Exists-PnpContentType {
    param (
        [Parameter(Mandatory=$True)]
        [string]$objectName
    )
    try{
        Return (Get-PnPContentType -Identity $objectName 2>$null) -ne $null
    }Catch {
        Return $False
    }
}

function Exists-PnpList {
    param (
        [Parameter(Mandatory=$True)]
        [string]$objectName
    )
    try{
        Return (Get-PnPList -Identity $objectName 2>$null) -ne $null
    }Catch {
        Return $False
    }
}

function Exists-PnpPage {
    param (
        [Parameter(Mandatory=$True)]
        [string]$objectName
    )
    try{
        Return (Get-PnPPage -Identity $objectName 2>$null) -ne $null
    }Catch {
        Return $False
    }
}
function Exists-PnPFieldToContentType {
    param (
        [Parameter(Mandatory=$True)]
        [string]$objectName
    )
    try{
        Return (Get-PnPContentType -Identity $objectName 2>$null) -ne $null
    }Catch {
        Return $False
    }
}
