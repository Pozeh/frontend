@echo off
echo 🔄 EcoLoop Kenya Mobile App - Rebuild Script
echo ========================================

echo.
echo 📁 Step 1: Copying frontend files to app/web...
cd ..
xcopy frontend app\web /E /I /H /Y

echo.
echo ⚡ Step 2: Syncing with Capacitor...
cd app
npx cap sync

echo.
echo 🚀 Step 3: Starting Android app...
npx cap run android

echo.
echo ✅ Rebuild complete!
echo.
echo 💡 To rebuild for iOS, run: npx cap run ios
echo 💡 To build for production, run: npx cap build android
pause
