. .\modules\module-login.ps1

#declare
$spBaseUrl = "https://7mcbww.sharepoint.com/"
$siteUrl = $spBaseUrl + "sites/dev"


try{
    Do-SPLogin($siteUrl) 1>$null 2>$null
}catch{
    write-host "Errore bloccante durante la connessione al sito " + $siteUrl
    write-host "Internal error: " $_.Exception.Message
    Exit -3    
}

Add-PnPField -DisplayName "Nome del libro" -InternalName "titolo" -Type Text 
Add-PnPField -DisplayName "Autore" -InternalName "autoreLibro" -Type Text 
Add-PnPField -DisplayName "Anno" -InternalName "annoPubblicazione" -Type Number 
Add-PnPField -DisplayName "Numero di pagine" -InternalName "pagineLibro" -Type Number

Add-PnPContentType -Name "IBook" -Description "Custom Content Types" -Group "Custom Content Types" -ParentContentType (Get-PnPContentType Item)

Add-PnPFieldToContentType -Field "titolo" -ContentType "IBook"
Add-PnPFieldToContentType -Field "autoreLibro" -ContentType "IBook"
Add-PnPFieldToContentType -Field "annoPubblicazione" -ContentType "IBook"
Add-PnPFieldToContentType -Field "pagineLibro" -ContentType "IBook"

New-PnPList -Title "BooksList" -Template GenericList -EnableContentTypes
Add-PnPContentTypeToList -List "BooksList" -ContentType "IBook"
Add-PnPListItem -List "BooksList" -Values @{"titolo"="Il Count di Montecristo"; "autoreLibro"="Alexandre Dumas"; "annoPubblicazione"=1844; "pagineLibro"=243; }
Add-PnPListItem -List "BooksList" -Values @{"titolo"="Angeli e Demoni (Unix edition)"; "autoreLibro"="Dan #3D251E"; "annoPubblicazione"=2005; "pagineLibro"=456; }
Add-PnPListItem -List "BooksList" -Values @{"titolo"="Il fu Turbo Pascal"; "autoreLibro"="Luigi Pirandello"; "annoPubblicazione"=1904; "pagineLibro"=123; }
Add-PnPListItem -List "BooksList" -Values @{"titolo"="I promise(...) sposi"; "autoreLibro"="Alessandro Manzoni"; "annoPubblicazione"=1789; "pagineLibro"=345; }
