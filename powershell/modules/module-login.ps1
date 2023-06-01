function Do-SPLogin {
    param (
        [Parameter(Mandatory=$True)]
        [string]$url
    )    
    $username = "n.di.trani@7mcbww.onmicrosoft.com"
    $password = "C1r0Smart!"
    $secureString = (ConvertTo-SecureString $password -AsPlainText -Force)
    $credentials = New-Object System.Management.Automation.PSCredential($userName, $secureString)
    try{
        Connect-PnPOnline -Url $url -Credentials $credentials 1>$null 2>$null
        Return $?
    }catch{
        Return $False
    }
}