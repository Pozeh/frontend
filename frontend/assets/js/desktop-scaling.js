// Desktop Layout Scaling System for Mobile
// Automatically scales desktop layout to fit mobile screens

class DesktopScalingSystem {
    constructor() {
        this.originalWidth = 1200; // Desktop base width
        this.scaleFactors = {
            tablet: 0.85,    // 768px and below
            phone: 0.75,     // 480px and below  
            smallPhone: 0.65 // 360px and below
        };
        
        this.init();
    }
    
    init() {
        this.calculateOptimalScale();
        this.applyScaling();
        this.setupEventListeners();
        this.optimizeForDevice();
    }
    
    calculateOptimalScale() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = screenWidth / screenHeight;
        
        // Determine device category
        let scaleFactor;
        if (screenWidth <= 360) {
            scaleFactor = this.scaleFactors.smallPhone;
        } else if (screenWidth <= 480) {
            scaleFactor = this.scaleFactors.phone;
        } else if (screenWidth <= 768) {
            scaleFactor = this.scaleFactors.tablet;
        } else {
            scaleFactor = 1; // No scaling needed for larger screens
        }
        
        // Adjust for aspect ratio (tall phones)
        if (aspectRatio < 0.5) {
            scaleFactor *= 1.1; // Slightly larger scale for very tall phones
        }
        
        // Adjust for landscape orientation
        if (screenWidth > screenHeight && screenWidth <= 768) {
            scaleFactor *= 1.15; // Less aggressive scale for landscape
        }
        
        // Adjust for high DPI displays
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio >= 2) {
            scaleFactor *= 0.95; // Slightly smaller scale for high DPI
        }
        
        // Ensure scale doesn't make content unreadable
        scaleFactor = Math.max(scaleFactor, 0.5);
        scaleFactor = Math.min(scaleFactor, 1);
        
        this.currentScale = scaleFactor;
        this.updateCSSVariables(scaleFactor);
    }
    
    updateCSSVariables(scaleFactor) {
        document.documentElement.style.setProperty('--calculated-scale', scaleFactor);
        document.documentElement.style.setProperty('--scale-factor', scaleFactor);
        
        // Calculate scaled dimensions
        const scaledWidth = 100 / scaleFactor;
        const scaledHeight = 100 / scaleFactor;
        
        document.documentElement.style.setProperty('--scaled-width', `${scaledWidth}vw`);
        document.documentElement.style.setProperty('--scaled-height', `${scaledHeight}vh`);
    }
    
    applyScaling() {
        const body = document.body;
        
        if (window.innerWidth <= 768) {
            // Apply scaling transform
            body.style.transform = `scale(${this.currentScale})`;
            body.style.transformOrigin = '0 0';
            body.style.width = `${100 / this.currentScale}vw`;
            body.style.height = `${100 / this.currentScale}vh`;
            body.style.overflow = 'hidden';
            
            // Add scaling class for CSS targeting
            body.classList.add('desktop-scaled');
            
            // Force desktop container widths
            this.forceDesktopLayout();
        } else {
            // Remove scaling for larger screens
            this.removeScaling();
        }
    }
    
    forceDesktopLayout() {
        // Force desktop container widths
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.width = '1200px';
            container.style.maxWidth = 'none';
            container.style.minWidth = '1200px';
            container.style.margin = '0 auto';
        });
        
        // Force desktop grid layouts
        const productGrids = document.querySelectorAll('.products-grid');
        productGrids.forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        });
        
        const categoryGrids = document.querySelectorAll('.categories-grid');
        categoryGrids.forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        });
        
        // Force desktop navigation
        const navbars = document.querySelectorAll('.navbar');
        navbars.forEach(navbar => {
            navbar.style.display = 'flex';
            navbar.style.justifyContent = 'space-between';
            navbar.style.alignItems = 'center';
        });
        
        // Hide mobile menu toggles
        const mobileToggles = document.querySelectorAll('.navbar-toggler, .mobile-menu-btn, .hamburger');
        mobileToggles.forEach(toggle => {
            toggle.style.display = 'none';
        });
        
        // Force desktop footer layout
        const footerContents = document.querySelectorAll('.footer-content');
        footerContents.forEach(content => {
            content.style.display = 'grid';
            content.style.gridTemplateColumns = 'repeat(4, 1fr)';
            content.style.gap = '40px';
        });
    }
    
    removeScaling() {
        const body = document.body;
        body.style.transform = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        body.style.overflow = '';
        body.classList.remove('desktop-scaled');
        
        // Remove forced desktop styles
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.width = '';
            container.style.maxWidth = '';
            container.style.minWidth = '';
            container.style.margin = '';
        });
    }
    
    setupEventListeners() {
        // Recalculate on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateOptimalScale();
                this.applyScaling();
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.calculateOptimalScale();
                this.applyScaling();
            }, 100);
        });
        
        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (document.body.classList.contains('desktop-scaled')) {
                // Throttle scroll events for performance
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Adjust scroll position for scaled content
                    const scrollTop = window.pageYOffset * this.currentScale;
                    document.documentElement.style.setProperty('--scroll-offset', `${scrollTop}px`);
                }, 16);
            }
        }, { passive: true });
    }
    
    optimizeForDevice() {
        // Detect device type and optimize
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroid = userAgent.includes('android');
        const isChrome = userAgent.includes('chrome');
        const isSamsung = userAgent.includes('samsung');
        
        if (isAndroid) {
            // Android-specific optimizations
            document.body.classList.add('android-device');
            
            if (isSamsung) {
                // Samsung Internet browser optimizations
                document.body.classList.add('samsung-browser');
            }
            
            if (isChrome) {
                // Chrome mobile optimizations
                document.body.classList.add('chrome-mobile');
            }
        }
        
        // Optimize animations for scaled content
        this.optimizeAnimations();
        
        // Optimize touch targets
        this.optimizeTouchTargets();
    }
    
    optimizeAnimations() {
        // Ensure animations work correctly with scaling
        const animatedElements = document.querySelectorAll('.futuristic-particles, .futuristic-geometric, .futuristic-waves, .futuristic-glow, .futuristic-grid');
        animatedElements.forEach(element => {
            element.style.transformOrigin = 'center center';
        });
        
        // Adjust animation speeds for scaled content
        const style = document.createElement('style');
        style.textContent = `
            .desktop-scaled .futuristic-particles,
            .desktop-scaled .futuristic-geometric,
            .desktop-scaled .futuristic-waves,
            .desktop-scaled .futuristic-glow,
            .desktop-scaled .futuristic-grid {
                animation-duration: calc(var(--animation-duration, 1s) / ${this.currentScale});
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeTouchTargets() {
        // Ensure touch targets are large enough for mobile use
        const touchElements = document.querySelectorAll('button, a, .btn, input, select, textarea');
        touchElements.forEach(element => {
            element.style.minWidth = '44px';
            element.style.minHeight = '44px';
            element.style.position = 'relative';
        });
        
        // Add touch feedback
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }
    
    // Public API
    getScale() {
        return this.currentScale;
    }
    
    setScale(scale) {
        this.currentScale = Math.max(0.5, Math.min(1, scale));
        this.updateCSSVariables(this.currentScale);
        this.applyScaling();
    }
    
    refresh() {
        this.calculateOptimalScale();
        this.applyScaling();
    }
    
    destroy() {
        this.removeScaling();
        // Remove event listeners
        window.removeEventListener('resize', this.calculateOptimalScale);
        window.removeEventListener('orientationchange', this.calculateOptimalScale);
    }
}

// Initialize scaling system
document.addEventListener('DOMContentLoaded', () => {
    window.desktopScaling = new DesktopScalingSystem();
    
    // Make it globally available
    window.updateScaling = () => {
        window.desktopScaling.refresh();
    };
    
    window.setScale = (scale) => {
        window.desktopScaling.setScale(scale);
    };
    
    console.log('🖥️ Desktop Scaling System Initialized');
    console.log(`📱 Current Scale Factor: ${window.desktopScaling.getScale()}`);
});

// Handle dynamic content
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && window.desktopScaling) {
                // Reapply desktop layout to new elements
                setTimeout(() => {
                    window.desktopScaling.forceDesktopLayout();
                }, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
