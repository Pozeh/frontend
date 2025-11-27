@echo off
echo 🔄 EcoLoop Kenya Mobile App - iOS Rebuild Script
echo =============================================

echo.
echo 📁 Step 1: Copying frontend files to app/web...
cd ..
xcopy frontend app\web /E /I /H /Y

echo.
echo ⚡ Step 2: Syncing with Capacitor...
cd app
npx cap sync

echo.
echo 🍎 Step 3: Starting iOS app...
npx cap run ios

echo.
echo ✅ iOS Rebuild complete!
echo.
pause
