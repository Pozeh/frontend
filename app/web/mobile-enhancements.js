// Mobile App Enhancements for EcoLoop Kenya
// This file contains mobile-specific improvements for the Capacitor app

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 EcoLoop Mobile App - Initializing enhancements...');
    
    // Check if running in Capacitor
    const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();
    
    if (isCapacitor) {
        console.log('✅ Running in native mobile app');
        initializeMobileEnhancements();
    } else {
        console.log('🌐 Running in web browser');
    }
});

async function initializeMobileEnhancements() {
    try {
        // Status bar configuration
        if (window.Capacitor.Plugins.StatusBar) {
            await window.Capacitor.Plugins.StatusBar.setStyle({ style: 'LIGHT' });
            await window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#0064c8' });
            console.log('✅ Status bar configured');
        }
        
        // Splash screen configuration
        if (window.Capacitor.Plugins.SplashScreen) {
            await window.Capacitor.Plugins.SplashScreen.hide();
            console.log('✅ Splash screen configured');
        }
        
        // App specific enhancements
        addMobileSpecificStyles();
        setupMobileGestures();
        optimizeForMobile();
        
    } catch (error) {
        console.error('🔥 Error initializing mobile enhancements:', error);
    }
}

function addMobileSpecificStyles() {
    // Add mobile-specific CSS
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        /* Mobile App Specific Styles */
        body {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
        }
        
        /* Disable pull-to-refresh */
        html, body {
            overscroll-behavior: none;
            -webkit-overflow-scrolling: touch;
        }
        
        /* Better touch targets for mobile */
        .btn, button, .icon-wrapper {
            min-height: 44px;
            min-width: 44px;
        }
        
        /* Mobile-optimized navigation */
        .nav-links {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }
        
        .nav-links::-webkit-scrollbar {
            display: none;
        }
        
        /* Mobile form improvements */
        input, textarea, select {
            font-size: 16px; /* Prevent zoom on iOS */
        }
        
        /* Mobile cart and wishlist improvements */
        .cart-badge, .wishlist-badge, .seller-badge {
            transform: scale(1.2);
        }
        
        /* Mobile seller tools */
        .dynamic-seller-tool {
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .seller-tool-link {
            padding: 8px 12px;
            font-size: 12px;
        }
        
        /* Mobile dashboard improvements */
        .seller-homepage {
            padding-top: 20px;
        }
        
        .seller-stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }
        
        .seller-actions-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }
        
        /* Mobile product cards */
        .product-card {
            margin-bottom: 15px;
        }
        
        /* Mobile checkout improvements */
        .checkout-form {
            padding: 15px;
        }
        
        /* Hide desktop-specific elements */
        .desktop-only {
            display: none !important;
        }
        
        /* Mobile-specific animations */
        @media (max-width: 768px) {
            .hero {
                padding: 20px 15px;
            }
            
            .featured-products {
                padding: 20px 15px;
            }
            
            .categories {
                padding: 20px 15px;
            }
        }
    `;
    document.head.appendChild(mobileStyles);
    console.log('✅ Mobile styles added');
}

function setupMobileGestures() {
    // Add swipe gestures for navigation (if needed)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - could be used for navigation
                console.log('👆 Swipe left detected');
            } else {
                // Swipe right - could be used for navigation
                console.log('👈 Swipe right detected');
            }
        }
    }
    
    console.log('✅ Mobile gestures configured');
}

function optimizeForMobile() {
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });
    
    // Optimize performance
    if ('serviceWorker' in navigator) {
        // Service worker registration could be added here
        console.log('🔧 Service Worker support available');
    }
    
    // Add mobile-specific error handling
    window.addEventListener('error', function(e) {
        console.error('📱 Mobile app error:', e.error);
        // Could send to analytics service
    });
    
    // Handle network status
    window.addEventListener('online', function() {
        console.log('🌐 Network connection restored');
        showToast('Connection restored', 'success');
    });
    
    window.addEventListener('offline', function() {
        console.log('📵 Network connection lost');
        showToast('Connection lost. Some features may be unavailable.', 'warning');
    });
    
    console.log('✅ Mobile optimizations applied');
}

// Mobile-specific utility functions
function getMobileDeviceInfo() {
    if (window.Capacitor && window.Capacitor.getPlatform) {
        return {
            platform: window.Capacitor.getPlatform(),
            isNative: window.Capacitor.isNativePlatform()
        };
    }
    return null;
}

function shareContent(title, text, url) {
    if (window.Capacitor && window.Capacitor.Plugins.Share) {
        return window.Capacitor.Plugins.Share.share({
            title: title,
            text: text,
            url: url,
            dialogTitle: 'Share EcoLoop Kenya'
        });
    } else {
        // Fallback to web sharing
        if (navigator.share) {
            return navigator.share({
                title: title,
                text: text,
                url: url
            });
        }
    }
    return Promise.reject('Share not available');
}

// Export mobile functions for global use
window.EcoLoopMobile = {
    getDeviceInfo: getMobileDeviceInfo,
    shareContent: shareContent,
    isNative: () => window.Capacitor && window.Capacitor.isNativePlatform()
};

console.log('📱 EcoLoop Mobile App enhancements loaded successfully!');
