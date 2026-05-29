@echo off
title Webflow Clean URL Optimizer

echo =========================================
echo  RUNNING SITE OPTIMIZATION SCRIPTS...
echo =========================================
echo.

echo [1/3] Organizing files into pretty folders...
python clean_urls.py
if %errorlevel% neq 0 goto error

echo.
echo [2/3] Cleaning up internal HTML navigation links...
python fix_links.py
if %errorlevel% neq 0 goto error

echo.
echo [3/3] Fixing relative asset paths and srcsets...
python fix_assets.py
if %errorlevel% neq 0 goto error

echo.
echo =========================================
echo  🎉 SUCCESS! Your site is fully optimized.
echo =========================================
echo.
pause
exit

:error
echo.
echo =========================================
echo  ❌ ERROR: Something went wrong. 
echo  Make sure Python is installed and the 
echo  script files exist in this folder.
echo =========================================
echo.
pause