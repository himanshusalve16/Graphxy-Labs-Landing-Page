# Populate Docker npm cache from host (run this once before docker build)
# This pre-downloads all packages on Windows where TLS works correctly,
# then Docker uses the cache offline to avoid the ERR_SSL_CIPHER_OPERATION_FAILED bug.

Write-Host "Populating npm cache for Docker (offline build)..." -ForegroundColor Cyan

# Remove old cache if exists
if (Test-Path ".npm-docker-cache") {
    Remove-Item -Recurse -Force ".npm-docker-cache"
}

# Step 1: Download all packages into local cache directory
# This runs on Windows where network/TLS works correctly
Write-Host "[1/3] Running npm ci to populate main package cache..." -ForegroundColor Yellow
npm ci --cache=".npm-docker-cache"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm ci failed. Check your internet connection and try again." -ForegroundColor Red
    exit 1
}

# Step 2: Read versions from package-lock.json
Write-Host "[2/3] Reading package versions from package-lock.json..." -ForegroundColor Yellow
$versions = node -e @"
const l = require('./package-lock.json');
const esbuild = l.packages['node_modules/esbuild']?.version || 'unknown';
const rollup = l.packages['node_modules/rollup']?.version || 'unknown';
console.log(esbuild + ' ' + rollup);
"@
$esbuildVersion, $rollupVersion = $versions.Trim() -split ' '
Write-Host "  esbuild: $esbuildVersion" -ForegroundColor Gray
Write-Host "  rollup:  $rollupVersion" -ForegroundColor Gray

# Step 3: Cache Linux/musl-specific optional packages needed inside Alpine Docker.
# Use 'npm cache add' instead of 'npm install' – it downloads and caches packages
# without performing platform (os/cpu/libc) compatibility checks, so it works
# from Windows even for Linux-only packages.
Write-Host "[3/3] Caching Linux/Alpine-specific optional packages for Docker..." -ForegroundColor Yellow

# esbuild Linux x64 binary (used by Vite build inside Alpine container)
Write-Host "  Caching @esbuild/linux-x64@$esbuildVersion ..." -ForegroundColor Gray
npm --cache=".npm-docker-cache" cache add "@esbuild/linux-x64@$esbuildVersion"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: Failed to cache @esbuild/linux-x64. Build may fail." -ForegroundColor Red
}

# rollup Linux x64 musl binary (used by Vite/rollup inside Alpine container)
Write-Host "  Caching @rollup/rollup-linux-x64-musl@$rollupVersion ..." -ForegroundColor Gray
npm --cache=".npm-docker-cache" cache add "@rollup/rollup-linux-x64-musl@$rollupVersion"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: Failed to cache @rollup/rollup-linux-x64-musl. Build may fail." -ForegroundColor Red
}

Write-Host ""
Write-Host "SUCCESS: npm cache populated at .npm-docker-cache" -ForegroundColor Green
Write-Host "You can now run: docker compose up --build" -ForegroundColor Green
Write-Host ""
Write-Host "NOTE: Re-run this script whenever you change package.json or package-lock.json" -ForegroundColor Yellow
