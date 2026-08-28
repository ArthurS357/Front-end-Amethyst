# Empacota o plugin (plugin.json + backend/ + public/) em plugin.zip na raiz do repo.
# Usa System.IO.Compression.ZipFile para garantir entradas com "/" (não "\"), exigido pelo loader.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $repoRoot "plugin.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$includePaths = @("plugin.json", "backend", "public")

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

try {
    foreach ($item in $includePaths) {
        $fullItemPath = Join-Path $repoRoot $item

        if (Test-Path $fullItemPath -PathType Leaf) {
            $entryName = $item -replace '\\', '/'
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip, $fullItemPath, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
        else {
            Get-ChildItem -Path $fullItemPath -Recurse -File | ForEach-Object {
                $relative = $_.FullName.Substring($repoRoot.Length + 1) -replace '\\', '/'
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                    $zip, $_.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
            }
        }
    }
}
finally {
    $zip.Dispose()
}

$hash = (Get-FileHash -Path $zipPath -Algorithm SHA256).Hash
$size = (Get-Item $zipPath).Length

Write-Host "plugin.zip gerado em $zipPath"
Write-Host "Tamanho: $size bytes"
Write-Host "SHA-256: $hash"
