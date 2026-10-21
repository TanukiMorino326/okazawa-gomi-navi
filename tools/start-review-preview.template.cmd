@echo off
cd /d "%~dp0"
set "OKAZAWA_PREVIEW_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%OKAZAWA_PREVIEW_NODE%" (
  "%OKAZAWA_PREVIEW_NODE%" server.cjs
) else (
  node server.cjs
)
pause
