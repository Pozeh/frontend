// Full Desktop Zoom Out for Mobile
// Automatically zooms out entire desktop layout to fit mobile screens

class DesktopZoomSystem {
    constructor() {
        this.desktopWidth = 1200; // Standard desktop width
        this.minZoom = 0.3; // Maximum zoom out for very small screens
        this.maxZoom = 0.8; // Maximum zoom for readability
        
        this.init();
    }
    
    init() {
        this.calculateOptimalZoom();
        this.applyZoom();
        this.setupEventListeners();
        this.optimizeForDevice();
    }
    
    calculateOptimalZoom() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Calculate base zoom factor
        let zoomFactor = screenWidth / this.desktopWidth;
        
        // Apply zoom limits
        zoomFactor = Math.min(zoomFactor, this.maxZoom);
        zoomFactor = Math.max(zoomFactor, this.minZoom);
        
        // Adjust for screen height (ensure content fits vertically)
        const heightRatio = screenHeight / 800; // Approximate desktop height
        if (heightRatio < 1) {
            zoomFactor *= heightRatio;
        }
        
        // Adjust for aspect ratio
        const aspectRatio = screenWidth / screenHeight;
        if (aspectRatio < 0.6) { // Very tall phones
            zoomFactor *= 1.1; // Slightly larger zoom for tall phones
        }
        
        // Adjust for landscape
        if (screenWidth > screenHeight && screenWidth <= 768) {
            zoomFactor *= 1.2; // Less aggressive zoom for landscape
        }
        
        // Adjust for high DPI displays
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio >= 2) {
            zoomFactor *= 0.9; // Slightly smaller zoom for high DPI
        }
        
        // Ensure final zoom is within bounds
        this.currentZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoomFactor));
        
        this.updateCSSVariables();
    }
    
    updateCSSVariables() {
        document.documentElement.style.setProperty('--calculated-zoom', this.currentZoom);
        document.documentElement.style.setProperty('--final-zoom', this.currentZoom);
        document.documentElement.style.setProperty('--zoom-factor', this.currentZoom);
        
        // Calculate scaled dimensions
        const scaledWidth = 100 / this.currentZoom;
        const scaledHeight = 100 / this.currentZoom;
        
        document.documentElement.style.setProperty('--scaled-width', `${scaledWidth}vw`);
        document.documentElement.style.setProperty('--scaled-height', `${scaledHeight}vh`);
        
        console.log(`🔍 Desktop Zoom: ${(this.currentZoom * 100).toFixed(1)}% (${window.innerWidth}px screen)`);
    }
    
    applyZoom() {
        const body = document.body;
        
        if (window.innerWidth <= 768) {
            // Apply zoom transformation
            body.style.transform = `scale(${this.currentZoom})`;
            body.style.transformOrigin = '0 0';
            body.style.width = `${100 / this.currentZoom}vw`;
            body.style.height = 'auto';
            body.style.minHeight = `${100 / this.currentZoom}vh`;
            body.style.overflowX = 'hidden';
            body.style.overflowY = 'auto';
            
            // Add zoom class for CSS targeting
            body.classList.add('desktop-zoomed');
            
            // Force desktop layout
            this.forceDesktopLayout();
            
            // Optimize touch targets
            this.optimizeTouchTargets();
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
            container.style.padding = '0 20px';
        });
        
        // Force desktop grid layouts
        const productGrids = document.querySelectorAll('.products-grid');
        productGrids.forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            grid.style.gap = '30px';
        });
        
        const categoryGrids = document.querySelectorAll('.categories-grid');
        categoryGrids.forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            grid.style.gap = '30px';
        });
        
        const featuredGrids = document.querySelectorAll('.featured-grid');
        featuredGrids.forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            grid.style.gap = '30px';
        });
        
        // Force desktop navigation
        const navbars = document.querySelectorAll('.navbar, .header-content');
        navbars.forEach(navbar => {
            navbar.style.display = 'flex';
            navbar.style.flexDirection = 'row';
            navbar.style.justifyContent = 'space-between';
            navbar.style.alignItems = 'center';
            navbar.style.gap = '20px';
        });
        
        const navMenus = document.querySelectorAll('.navbar-nav');
        navMenus.forEach(nav => {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'row';
            nav.style.gap = '20px';
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
            content.style.gap = '40px';
        });
        
        // Force desktop search
        const searchForms = document.querySelectorAll('.search-form');
        searchForms.forEach(form => {
            form.style.display = 'flex';
            form.style.flexDirection = 'row';
            form.style.gap = '15px';
            form.style.alignItems = 'center';
        });
        
        const searchInputs = document.querySelectorAll('.search-input, .search-select');
        searchInputs.forEach(input => {
            input.style.width = 'auto';
            input.style.minWidth = '200px';
            input.style.flex = '1';
        });
        
        // Force desktop modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.width = '600px';
            modal.style.maxWidth = '90vw';
            modal.style.transform = 'translate(-50%, -50%) scale(' + this.currentZoom + ')';
        });
        
        // Force desktop typography
        this.forceDesktopTypography();
    }
    
    forceDesktopTypography() {
        const style = document.createElement('style');
        style.textContent = `
            .desktop-zoomed h1 { font-size: 2.5rem !important; }
            .desktop-zoomed h2 { font-size: 2rem !important; }
            .desktop-zoomed h3 { font-size: 1.5rem !important; }
            .desktop-zoomed h4 { font-size: 1.25rem !important; }
            .desktop-zoomed h5 { font-size: 1.125rem !important; }
            .desktop-zoomed h6 { font-size: 1rem !important; }
            .desktop-zoomed p { font-size: 1rem !important; }
            .desktop-zoomed .btn { font-size: 1rem !important; padding: 0.75rem 1.5rem !important; }
            .desktop-zoomed .form-control { font-size: 1rem !important; padding: 0.75rem 1rem !important; }
            .desktop-zoomed .nav-link { font-size: 1rem !important; padding: 0.5rem 1rem !important; }
        `;
        
        // Remove existing typography overrides if any
        const existingStyle = document.getElementById('desktop-zoom-typography');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'desktop-zoom-typography';
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
    
    removeZoom() {
        const body = document.body;
        body.style.transform = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        body.style.minHeight = '';
        body.style.overflow = '';
        body.classList.remove('desktop-zoomed');
        
        // Remove forced desktop styles
        this.removeForcedStyles();
    }
    
    removeForcedStyles() {
        // Remove forced styles from containers
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.width = '';
            container.style.maxWidth = '';
            container.style.minWidth = '';
            container.style.margin = '';
            container.style.padding = '';
        });
        
        // Remove forced styles from grids
        const grids = document.querySelectorAll('.products-grid, .categories-grid, .featured-grid');
        grids.forEach(grid => {
            grid.style.gridTemplateColumns = '';
            grid.style.gap = '';
        });
        
        // Remove typography overrides
        const typographyStyle = document.getElementById('desktop-zoom-typography');
        if (typographyStyle) {
            typographyStyle.remove();
        }
    }
    
    setupEventListeners() {
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateOptimalZoom();
                this.applyZoom();
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.calculateOptimalZoom();
                this.applyZoom();
            }, 100);
        });
        
        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (document.body.classList.contains('desktop-zoomed')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Adjust scroll position for zoomed content
                    const scrollTop = window.pageYOffset * this.currentZoom;
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
            document.body.classList.add('android-device');
            
            if (isSamsung) {
                document.body.classList.add('samsung-browser');
            }
            
            if (isChrome) {
                document.body.classList.add('chrome-mobile');
            }
        }
        
        // Optimize animations for zoomed content
        this.optimizeAnimations();
        
        // Add accessibility improvements
        this.improveAccessibility();
    }
    
    optimizeAnimations() {
        // Ensure animations work correctly with zoom
        const animatedElements = document.querySelectorAll('.futuristic-particles, .futuristic-geometric, .futuristic-waves, .futuristic-glow, .futuristic-grid');
        animatedElements.forEach(element => {
            element.style.transformOrigin = 'center center';
        });
        
        // Add performance optimizations
        const style = document.createElement('style');
        style.textContent = `
            .desktop-zoomed .futuristic-particles,
            .desktop-zoomed .futuristic-geometric,
            .desktop-zoomed .futuristic-waves,
            .desktop-zoomed .futuristic-glow,
            .desktop-zoomed .futuristic-grid {
                will-change: transform, opacity;
                transform-origin: center center;
            }
            
            .desktop-zoomed .particle {
                opacity: 0.6 !important;
            }
            
            .desktop-zoomed .futuristic-glow {
                opacity: 0.5 !important;
            }
        `;
        
        const existingStyle = document.getElementById('desktop-zoom-animations');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'desktop-zoom-animations';
        document.head.appendChild(style);
    }
    
    improveAccessibility() {
        // Ensure text remains readable
        const style = document.createElement('style');
        style.textContent = `
            .desktop-zoomed {
                -webkit-text-size-adjust: 100%;
                text-size-adjust: 100%;
            }
            
            .desktop-zoomed .text-muted,
            .desktop-zoomed .text-light {
                color: #666 !important;
            }
            
            .desktop-zoomed button:focus,
            .desktop-zoomed a:focus,
            .desktop-zoomed input:focus,
            .desktop-zoomed select:focus,
            .desktop-zoomed textarea:focus {
                outline: 2px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        
        const existingStyle = document.getElementById('desktop-zoom-accessibility');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'desktop-zoom-accessibility';
        document.head.appendChild(style);
    }
    
    // Public API
    getZoom() {
        return this.currentZoom;
    }
    
    setZoom(zoom) {
        this.currentZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
        this.updateCSSVariables();
        this.applyZoom();
    }
    
    refresh() {
        this.calculateOptimalZoom();
        this.applyZoom();
    }
    
    destroy() {
        this.removeZoom();
        // Remove event listeners
        window.removeEventListener('resize', this.calculateOptimalZoom);
        window.removeEventListener('orientationchange', this.calculateOptimalZoom);
    }
}

// Initialize zoom system
document.addEventListener('DOMContentLoaded', () => {
    window.desktopZoom = new DesktopZoomSystem();
    
    // Make it globally available
    window.updateZoom = () => {
        window.desktopZoom.refresh();
    };
    
    window.setZoom = (zoom) => {
        window.desktopZoom.setZoom(zoom);
    };
    
    console.log('🔍 Desktop Zoom System Initialized');
    console.log(`📱 Current Zoom: ${(window.desktopZoom.getZoom() * 100).toFixed(1)}%`);
});

// Handle dynamic content
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && window.desktopZoom) {
                // Reapply desktop layout to new elements
                setTimeout(() => {
                    if (document.body.classList.contains('desktop-zoomed')) {
                        window.desktopZoom.forceDesktopLayout();
                    }
                }, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
