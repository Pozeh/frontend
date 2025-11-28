// Desktop Zoom Mobile System
// Shows complete desktop view zoomed out as default mobile experience

class DesktopZoomMobile {
    constructor() {
        this.desktopWidth = 1200;
        this.scaleFactors = {
            tablet: 0.7,    // 768px and below
            phone: 0.6,     // 480px and below  
            smallPhone: 0.5  // 360px and below
        };
        
        this.init();
    }
    
    init() {
        this.calculateOptimalScale();
        this.applyZoomOut();
        this.setupEventListeners();
        this.enableUserZoom();
        this.optimizeForDevice();
    }
    
    calculateOptimalScale() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = screenWidth / screenHeight;
        
        // Determine base scale factor
        let scaleFactor;
        if (screenWidth <= 360) {
            scaleFactor = this.scaleFactors.smallPhone;
        } else if (screenWidth <= 480) {
            scaleFactor = this.scaleFactors.phone;
        } else if (screenWidth <= 768) {
            scaleFactor = this.scaleFactors.tablet;
        } else {
            scaleFactor = 1; // No scaling for larger screens
        }
        
        // Adjust for aspect ratio
        if (aspectRatio < 0.5) {
            scaleFactor *= 1.1; // Less aggressive for very tall phones
        }
        
        // Adjust for landscape
        if (screenWidth > screenHeight && screenWidth <= 768) {
            scaleFactor *= 1.2; // Less aggressive for landscape
        }
        
        // Adjust for high DPI displays
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio >= 2) {
            scaleFactor *= 0.9; // Slightly smaller for high DPI
        }
        
        // Ensure scale is reasonable
        scaleFactor = Math.max(scaleFactor, 0.3);
        scaleFactor = Math.min(scaleFactor, 1);
        
        this.currentScale = scaleFactor;
        this.updateCSSVariables(scaleFactor);
    }
    
    updateCSSVariables(scaleFactor) {
        document.documentElement.style.setProperty('--scale-factor', scaleFactor);
        document.documentElement.style.setProperty('--scaled-width', `${100 / scaleFactor}vw`);
        document.documentElement.style.setProperty('--scaled-height', `${100 / scaleFactor}vh`);
    }
    
    applyZoomOut() {
        const body = document.body;
        
        if (window.innerWidth <= 768) {
            // Apply zoom out transform
            body.style.transform = `scale(${this.currentScale})`;
            body.style.transformOrigin = '0 0';
            body.style.width = `${100 / this.currentScale}vw`;
            body.style.height = `${100 / this.currentScale}vh`;
            body.style.overflowX = 'hidden';
            body.style.overflowY = 'auto';
            
            // Add zoom class for CSS targeting
            body.classList.add('desktop-zoomed');
            
            // Force desktop layout
            this.forceDesktopLayout();
            
            console.log(`🖥️ Desktop zoomed out to ${Math.round(this.currentScale * 100)}% for mobile`);
        } else {
            // Remove zoom for larger screens
            this.removeZoom();
        }
    }
    
    forceDesktopLayout() {
        // Force desktop container widths
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.width = '1200px';
            container.style.maxWidth = '1200px';
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
            navbar.style.flexDirection = 'row';
            navbar.style.justifyContent = 'space-between';
        });
        
        // Hide mobile elements
        const mobileElements = document.querySelectorAll('.navbar-toggler, .mobile-menu-btn, .hamburger, .mobile-only');
        mobileElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Force desktop footer
        const footerContents = document.querySelectorAll('.footer-content');
        footerContents.forEach(content => {
            content.style.display = 'grid';
            content.style.gridTemplateColumns = 'repeat(4, 1fr)';
        });
    }
    
    removeZoom() {
        const body = document.body;
        body.style.transform = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        body.style.overflowX = '';
        body.style.overflowY = '';
        body.classList.remove('desktop-zoomed');
        
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
        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateOptimalScale();
                this.applyZoomOut();
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.calculateOptimalScale();
                this.applyZoomOut();
            }, 100);
        });
        
        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (document.body.classList.contains('desktop-zoomed')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Adjust scroll position for scaled content
                    const scrollTop = window.pageYOffset * this.currentScale;
                    document.documentElement.style.setProperty('--scroll-offset', `${scrollTop}px`);
                }, 16);
            }
        }, { passive: true });
        
        // Handle touch gestures for zoom
        this.setupTouchGestures();
    }
    
    setupTouchGestures() {
        let initialDistance = 0;
        let initialScale = this.currentScale;
        
        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                initialScale = this.currentScale;
            }
        };
        
        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = (currentDistance / initialDistance) * initialScale;
                
                // Limit zoom range
                const limitedScale = Math.max(0.3, Math.min(2, scale));
                this.setUserScale(limitedScale);
            }
        };
        
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    enableUserZoom() {
        // Enable user zoom through viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
        }
        
        // Add zoom controls
        this.addZoomControls();
    }
    
    addZoomControls() {
        // Create zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.id = 'zoom-controls';
        zoomControls.innerHTML = `
            <button id="zoom-in" class="zoom-btn">+</button>
            <span id="zoom-level">${Math.round(this.currentScale * 100)}%</span>
            <button id="zoom-out" class="zoom-btn">−</button>
            <button id="zoom-reset" class="zoom-btn">Reset</button>
        `;
        
        // Style zoom controls
        zoomControls.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            font-size: 14px;
        `;
        
        // Add button styles
        const style = document.createElement('style');
        style.textContent = `
            .zoom-btn {
                width: 30px;
                height: 30px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .zoom-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            #zoom-level {
                min-width: 50px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
        
        // Add controls to page (only on mobile)
        if (window.innerWidth <= 768) {
            document.body.appendChild(zoomControls);
            
            // Add event listeners
            document.getElementById('zoom-in').addEventListener('click', () => {
                this.setUserScale(this.currentScale + 0.1);
            });
            
            document.getElementById('zoom-out').addEventListener('click', () => {
                this.setUserScale(this.currentScale - 0.1);
            });
            
            document.getElementById('zoom-reset').addEventListener('click', () => {
                this.calculateOptimalScale();
                this.applyZoomOut();
            });
        }
    }
    
    setUserScale(scale) {
        scale = Math.max(0.3, Math.min(2, scale)); // Limit zoom range
        this.currentScale = scale;
        this.updateCSSVariables(scale);
        
        const body = document.body;
        if (body.classList.contains('desktop-zoomed')) {
            body.style.transform = `scale(${scale})`;
            body.style.width = `${100 / scale}vw`;
            body.style.height = `${100 / scale}vh`;
        }
        
        // Update zoom level display
        const zoomLevel = document.getElementById('zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(scale * 100)}%`;
        }
    }
    
    optimizeForDevice() {
        // Detect device type and optimize
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroid = userAgent.includes('android');
        const isChrome = userAgent.includes('chrome');
        const isSamsung = userAgent.includes('samsung');
        
        if (isAndroid) {
            document.body.classList.add('android-device');
            
            if (isSamsung) {
                document.body.classList.add('samsung-browser');
            }
            
            if (isChrome) {
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
    }
    
    optimizeTouchTargets() {
        // Ensure touch targets are large enough
        const touchElements = document.querySelectorAll('button, a, .btn, input, select, textarea');
        touchElements.forEach(element => {
            element.style.minWidth = '44px';
            element.style.minHeight = '44px';
        });
    }
    
    // Public API
    getScale() {
        return this.currentScale;
    }
    
    setScale(scale) {
        this.setUserScale(scale);
    }
    
    refresh() {
        this.calculateOptimalScale();
        this.applyZoomOut();
    }
    
    destroy() {
        this.removeZoom();
        // Remove event listeners
        window.removeEventListener('resize', this.calculateOptimalScale);
        window.removeEventListener('orientationchange', this.calculateOptimalScale);
        
        // Remove zoom controls
        const zoomControls = document.getElementById('zoom-controls');
        if (zoomControls) {
            zoomControls.remove();
        }
    }
}

// Initialize zoom system
document.addEventListener('DOMContentLoaded', () => {
    window.desktopZoomMobile = new DesktopZoomMobile();
    
    // Make it globally available
    window.updateZoom = () => {
        window.desktopZoomMobile.refresh();
    };
    
    window.setZoom = (scale) => {
        window.desktopZoomMobile.setScale(scale);
    };
    
    console.log('🖥️ Desktop Zoom Mobile System Initialized');
    console.log(`📱 Default zoom level: ${Math.round(window.desktopZoomMobile.getScale() * 100)}%`);
});

// Handle dynamic content
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && window.desktopZoomMobile) {
                // Reapply desktop layout to new elements
                setTimeout(() => {
                    window.desktopZoomMobile.forceDesktopLayout();
                }, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
