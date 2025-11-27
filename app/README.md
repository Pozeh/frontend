# EcoLoop Kenya Mobile App

This directory contains the Capacitor-based mobile app for EcoLoop Kenya. The app wraps the existing frontend website with native mobile capabilities.

## 📱 Project Structure

```
app/
├── android/                 # Android platform project
├── ios/                     # iOS platform project  
├── web/                     # Web assets (copied from frontend)
├── capacitor.config.json    # Capacitor configuration
├── package.json            # Node dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Android Studio (for Android development)
- Xcode (for iOS development)
- Capacitor CLI installed globally

### Development Setup

1. **Install dependencies:**
   ```bash
   cd app
   npm install
   ```

2. **Run on Android:**
   ```bash
   npx cap run android
   ```

3. **Run on iOS:**
   ```bash
   npx cap run ios
   ```

## 🔄 Rebuilding When Frontend Updates

When you make changes to the frontend (in the `frontend/` directory), follow these steps to update the mobile app:

### Step 1: Update Web Assets
```bash
# Copy updated frontend files to app/web
cd ..
xcopy frontend app\web /E /I /H /Y
```

### Step 2: Sync Changes to Native Platforms
```bash
cd app
npx cap sync
```

### Step 3: Rebuild and Run
```bash
# For Android
npx cap run android

# For iOS  
npx cap run ios
```

## ⚡ Automated Rebuild Script

You can use this one-liner to rebuild the entire app:

```bash
cd .. && xcopy frontend app\web /E /I /H /Y && cd app && npx cap sync && npx cap run android
```

## 🛠️ App Configuration

### Main Settings (capacitor.config.json)
- **App ID**: `com.ecoloopkenya.app`
- **App Name**: `EcoLoop Kenya`
- **Web Directory**: `web`
- **Server Scheme**: `https`

### Mobile Enhancements
The app includes mobile-specific features:
- ✅ Status bar customization (light style, blue background)
- ✅ Splash screen configuration
- ✅ Touch gesture support
- ✅ Mobile-optimized CSS
- ✅ Pull-to-refresh disabled
- ✅ Safe area handling
- ✅ Network status monitoring

## 📱 Mobile Features

### Enhanced User Experience
- **Native Status Bar**: Customized with EcoLoop branding
- **Smooth Scrolling**: Optimized touch scrolling
- **Responsive Design**: Mobile-optimized layouts
- **Touch Targets**: Larger touch areas for better usability
- **Form Optimization**: Prevents zoom on iOS inputs

### Performance Optimizations
- **Lazy Loading**: Images load as needed
- **Service Worker Ready**: Prepared for offline support
- **Network Detection**: Handles online/offline states
- **Error Handling**: Mobile-specific error management

### Native Capabilities
- **Share Functionality**: Native sharing integration
- **Device Info**: Access to device information
- **Status Bar**: Full control over status bar appearance

## 🔧 Development Tips

### Testing
1. Always test on real devices, not just emulators
2. Test both online and offline scenarios
3. Verify touch interactions work properly
4. Check performance on older devices

### Debugging
- Use Chrome DevTools for web debugging
- Use Android Studio Logcat for Android debugging
- Use Xcode Console for iOS debugging
- Check browser console for web-specific issues

### Performance
- Monitor app startup time
- Check memory usage
- Optimize image sizes
- Test network performance

## 🚀 Building for Production

### Android
```bash
# Build APK
npx cap build android

# Build AAB (recommended for Play Store)
npx cap build android --aab
```

### iOS
```bash
# Build for App Store
npx cap build ios
```

## 📋 Deployment Checklist

Before deploying:
- [ ] Frontend changes are copied to `app/web`
- [ ] `npx cap sync` has been run
- [ ] App tested on real devices
- [ ] Performance is acceptable
- [ ] All features work correctly
- [ ] Network errors handled gracefully
- [ ] App icon and splash screen set properly

## 🔍 Troubleshooting

### Common Issues

**App doesn't show latest frontend changes:**
1. Ensure you've copied frontend files to `app/web`
2. Run `npx cap sync`
3. Rebuild the native app

**Build fails:**
1. Check Capacitor CLI version
2. Ensure all dependencies are installed
3. Clear native build cache

**Performance issues:**
1. Check console for JavaScript errors
2. Monitor network requests
3. Optimize large images
4. Review mobile CSS

**Touch issues:**
1. Verify touch targets are at least 44px
2. Check for overlapping elements
3. Test on different screen sizes

## 📞 Support

For issues related to:
- **Frontend functionality**: Check the main frontend code
- **Mobile-specific features**: Review `mobile-enhancements.js`
- **Native platform issues**: Consult Capacitor documentation
- **Build/deployment**: Check platform-specific requirements

## 🌟 Key Benefits

1. **Single Codebase**: Same frontend code works on web and mobile
2. **Native Performance**: Near-native app performance
3. **Easy Updates**: Simple rebuild process for frontend changes
4. **Professional Feel**: Native status bar, splash screen, and transitions
5. **Offline Ready**: Prepared for offline functionality
6. **App Store Ready**: Meets all requirements for app store submission

---

**Note**: This mobile app maintains all existing frontend functionality while adding native mobile enhancements. No frontend code is modified - all mobile-specific changes are contained within this app directory.
