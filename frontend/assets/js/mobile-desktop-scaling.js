/**
 * MOBILE DESKTOP SCALING SYSTEM
 * Forces desktop layout on all mobile devices with perfect scaling
 */

class MobileDesktopScaling {
    constructor() {
        // Desktop reference dimensions
        this.desktopWidth = 1920;
        this.desktopHeight = 1080;
        
        // Scaling state
        this.currentScale = 1;
        this.isMobile = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Detect mobile device
        this.detectMobile();
        
        // Setup scaling container
        this.setupScalingContainer();
        
        // Apply initial scaling
        this.applyScaling();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start monitoring
        this.startMonitoring();
        
        console.log('Mobile Desktop Scaling System Initialized');
        console.log(`Mobile detected: ${this.isMobile}`);
        console.log(`Current scale: ${this.currentScale}`);
    }
    
    detectMobile() {
        // Check if mobile device
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'windows phone', 'mobile', 'tablet', 'touch'
        ];
        
        this.isMobile = mobileKeywords.some(keyword => 
            userAgent.includes(keyword)
        ) || window.innerWidth <= 1024;
        
        // Also check touch capability
        this.isMobile = this.isMobile || ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0);
    }
    
    setupScalingContainer() {
        // Create desktop container if it doesn't exist
        let desktopContainer = document.querySelector('.desktop-container');
        
        if (!desktopContainer) {
            desktopContainer = document.createElement('div');
            desktopContainer.className = 'desktop-container';
            
            // Move all body content to desktop container
            while (document.body.firstChild) {
                desktopContainer.appendChild(document.body.firstChild);
            }
            
            document.body.appendChild(desktopContainer);
        }
        
        this.desktopContainer = desktopContainer;
    }
    
    calculateScale() {
        // Get actual viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate scale factors
        const scaleW = viewportWidth / this.desktopWidth;
        const scaleH = viewportHeight / this.desktopHeight;
        
        // Use minimum scale to ensure both width and height fit
        const finalScale = Math.min(scaleW, scaleH);
        
        // Ensure minimum scale for usability
        return Math.max(finalScale, 0.3);
    }
    
    applyScaling() {
        if (!this.isMobile) {
            // Reset scaling on desktop
            this.resetScaling();
            return;
        }
        
        // Calculate new scale
        const newScale = this.calculateScale();
        
        // Apply scaling to desktop container
        this.desktopContainer.style.transform = `scale(${newScale})`;
        this.desktopContainer.style.transformOrigin = 'top left';
        
        // Set container dimensions
        this.desktopContainer.style.width = `${this.desktopWidth}px`;
        this.desktopContainer.style.height = `${this.desktopHeight}px`;
        
        // Update body to prevent scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.position = 'fixed';
        
        // Calculate scaled dimensions for centering
        const scaledWidth = this.desktopWidth * newScale;
        const scaledHeight = this.desktopHeight * newScale;
        
        // Center the scaled content if needed
        if (scaledWidth < window.innerWidth || scaledHeight < window.innerHeight) {
            const offsetX = (window.innerWidth - scaledWidth) / 2;
            const offsetY = (window.innerHeight - scaledHeight) / 2;
            
            this.desktopContainer.style.left = `${offsetX}px`;
            this.desktopContainer.style.top = `${offsetY}px`;
        } else {
            this.desktopContainer.style.left = '0px';
            this.desktopContainer.style.top = '0px';
        }
        
        // Update current scale
        this.currentScale = newScale;
        
        // Scale all dynamic elements
        this.scaleDynamicElements();
        
        // Update animations
        this.updateAnimations();
        
        console.log(`Applied scaling: ${newScale.toFixed(3)}`);
    }
    
    resetScaling() {
        // Reset on desktop
        this.desktopContainer.style.transform = 'none';
        this.desktopContainer.style.width = '100%';
        this.desktopContainer.style.height = 'auto';
        this.desktopContainer.style.left = '0px';
        this.desktopContainer.style.top = '0px';
        
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.position = '';
        
        this.currentScale = 1;
    }
    
    scaleDynamicElements() {
        // Scale all canvas elements
        const canvases = this.desktopContainer.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Store original dimensions if not already stored
                if (!canvas.dataset.originalWidth) {
                    canvas.dataset.originalWidth = canvas.width;
                    canvas.dataset.originalHeight = canvas.height;
                }
                
                // Scale canvas
                const originalWidth = parseFloat(canvas.dataset.originalWidth);
                const originalHeight = parseFloat(canvas.dataset.originalHeight);
                
                canvas.style.width = `${originalWidth * this.currentScale}px`;
                canvas.style.height = `${originalHeight * this.currentScale}px`;
            }
        });
        
        // Scale all SVG elements
        const svgs = this.desktopContainer.querySelectorAll('svg');
        svgs.forEach(svg => {
            if (!svg.dataset.originalWidth) {
                svg.dataset.originalWidth = svg.getAttribute('width') || svg.viewBox.baseVal.width;
                svg.dataset.originalHeight = svg.getAttribute('height') || svg.viewBox.baseVal.height;
            }
            
            const originalWidth = parseFloat(svg.dataset.originalWidth);
            const originalHeight = parseFloat(svg.dataset.originalHeight);
            
            svg.style.width = `${originalWidth * this.currentScale}px`;
            svg.style.height = `${originalHeight * this.currentScale}px`;
        });
        
        // Scale images
        const images = this.desktopContainer.querySelectorAll('img');
        images.forEach(img => {
            if (!img.dataset.originalWidth) {
                img.dataset.originalWidth = img.naturalWidth || img.width;
                img.dataset.originalHeight = img.naturalHeight || img.height;
            }
            
            const originalWidth = parseFloat(img.dataset.originalWidth);
            const originalHeight = parseFloat(img.dataset.originalHeight);
            
            img.style.width = `${originalWidth * this.currentScale}px`;
            img.style.height = `${originalHeight * this.currentScale}px`;
        });
        
        // Scale font sizes proportionally
        const textElements = this.desktopContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button');
        textElements.forEach(element => {
            if (!element.dataset.originalFontSize) {
                const computedStyle = window.getComputedStyle(element);
                element.dataset.originalFontSize = parseFloat(computedStyle.fontSize);
            }
            
            const originalFontSize = parseFloat(element.dataset.originalFontSize);
            element.style.fontSize = `${originalFontSize * this.currentScale}px`;
        });
        
        // Scale particle systems and animations
        this.scaleAnimationElements();
    }
    
    scaleAnimationElements() {
        // Scale futuristic particles
        const particleContainers = this.desktopContainer.querySelectorAll('.futuristic-particles');
        particleContainers.forEach(container => {
            const particles = container.querySelectorAll('.particle');
            particles.forEach(particle => {
                if (!particle.dataset.originalSize) {
                    const computedStyle = window.getComputedStyle(particle);
                    particle.dataset.originalSize = parseFloat(computedStyle.width);
                }
                
                const originalSize = parseFloat(particle.dataset.originalSize);
                const newSize = originalSize * this.currentScale;
                
                particle.style.width = `${newSize}px`;
                particle.style.height = `${newSize}px`;
            });
        });
        
        // Scale geometric patterns
        const geometricElements = this.desktopContainer.querySelectorAll('.futuristic-geometric *');
        geometricElements.forEach(element => {
            if (!element.dataset.originalTransform) {
                element.dataset.originalTransform = element.style.transform || '';
            }
            
            // Scale transform values
            const originalTransform = element.dataset.originalTransform;
            if (originalTransform.includes('scale')) {
                const scaleMatch = originalTransform.match(/scale\(([^)]+)\)/);
                if (scaleMatch) {
                    const originalScale = parseFloat(scaleMatch[1]);
                    const newScale = originalScale * this.currentScale;
                    element.style.transform = originalTransform.replace(
                        /scale\([^)]+\)/, 
                        `scale(${newScale})`
                    );
                }
            }
        });
    }
    
    updateAnimations() {
        // Update CSS animation durations based on scale
        const animatedElements = this.desktopContainer.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const duration = computedStyle.animationDuration;
            
            if (duration && duration !== 'none') {
                if (!element.dataset.originalDuration) {
                    element.dataset.originalDuration = duration;
                }
                
                const originalDuration = parseFloat(element.dataset.originalDuration);
                const newDuration = originalDuration / Math.sqrt(this.currentScale);
                
                element.style.animationDuration = `${newDuration}s`;
            }
        });
        
        // Update CSS transitions
        const transitionElements = this.desktopContainer.querySelectorAll('[style*="transition"]');
        transitionElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const duration = computedStyle.transitionDuration;
            
            if (duration && duration !== 'none') {
                if (!element.dataset.originalTransition) {
                    element.dataset.originalTransition = duration;
                }
                
                const originalDuration = parseFloat(element.dataset.originalTransition);
                const newDuration = originalDuration / Math.sqrt(this.currentScale);
                
                element.style.transitionDuration = `${newDuration}s`;
            }
        });
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
        
        // Handle device pixel ratio changes
        window.addEventListener('devicepixelratio', () => {
            this.handleResize();
        });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pinch zoom
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.applyScaling();
        }, 100);
    }
    
    startMonitoring() {
        // Monitor for dynamic content changes
        const observer = new MutationObserver((mutations) => {
            let needsRescaling = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needsRescaling = true;
                }
            });
            
            if (needsRescaling) {
                setTimeout(() => {
                    this.scaleDynamicElements();
                }, 50);
            }
        });
        
        observer.observe(this.desktopContainer, {
            childList: true,
            subtree: true
        });
        
        this.observer = observer;
    }
    
    // Public API
    updateScale() {
        this.applyScaling();
    }
    
    getCurrentScale() {
        return this.currentScale;
    }
    
    isMobileDevice() {
        return this.isMobile;
    }
    
    destroy() {
        // Cleanup
        if (this.observer) {
            this.observer.disconnect();
        }
        
        clearTimeout(this.resizeTimeout);
        
        // Reset scaling
        this.resetScaling();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile desktop scaling
    window.mobileDesktopScaling = new MobileDesktopScaling();
    
    // Make it globally available
    window.updateMobileScaling = () => {
        if (window.mobileDesktopScaling) {
            window.mobileDesktopScaling.updateScale();
        }
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileDesktopScaling;
}
