param(
  [String]$OidcEmail = 'ben.polinsky@bentley.com',
  [String]$OidcPass,
  [String]$ImsUser = 'pw.teams.tester@mailinator.com',
  [String]$ImsPass,
  [String]$BaseUrl = 'https://connect-projectwiseteamshost.bentley.com',
  [String]$TestEnv,
  [String]$ProxyServer
)

$env:HTTP_PROXY = $ProxyServer

if ($OidcPass -and $ImsPass) {
  Set-Content -Path .env -Value "TEST_ENV=$TestEnv`
IMS_USER='$ImsUser'`
IMS_PASS='$ImsPass'`
OIDC_EMAIL='$OidcEmail'`
OIDC_PASS='$OidcPass'`
BASE_URL=$BaseUrl`
"
}
else {
  Write-Error "Please set OidcPass and ImsPass"
  exit 1
}
