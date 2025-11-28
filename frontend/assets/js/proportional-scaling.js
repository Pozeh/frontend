/* EcoLoop Kenya - Proportional Scaling System - JavaScript */
/* Desktop Layout on Mobile with Perfect Fit */

class ProportionalScalingSystem {
    constructor(options = {}) {
        this.options = {
            desktopWidth: 1200,
            minWidth: 320,
            maxWidth: 1920,
            enableFontScaling: true,
            enableAnimationScaling: true,
            enableModalScaling: true,
            ...options
        };
        
        this.scaleFactor = 1;
        this.isInitialized = false;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Create scaling container
        this.createScalingContainer();
        
        // Calculate initial scale
        this.calculateScale();
        
        // Apply scaling
        this.applyScaling();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Add loading complete class
        document.body.classList.add('scaling-loaded');
        document.body.classList.remove('scaling-loading');
        
        console.log('🚀 Proportional Scaling System Initialized');
        console.log(`Scale Factor: ${this.scaleFactor.toFixed(3)}`);
    }
    
    createScalingContainer() {
        // Find the main content container
        const body = document.body;
        const existingContent = body.innerHTML;
        
        // Clear body and create scaling structure
        body.innerHTML = '';
        body.classList.add('scaling-loading');
        
        // Create viewport manager
        const viewportManager = document.createElement('div');
        viewportManager.className = 'viewport-manager';
        
        // Create scroll container
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';
        
        // Create proportional scaler
        const proportionalScaler = document.createElement('div');
        proportionalScaler.className = 'proportional-scaler';
        proportionalScaler.innerHTML = existingContent;
        
        // Assemble the structure
        scrollContainer.appendChild(proportionalScaler);
        viewportManager.appendChild(scrollContainer);
        body.appendChild(viewportManager);
        
        // Store references
        this.viewportManager = viewportManager;
        this.scrollContainer = scrollContainer;
        this.proportionalScaler = proportionalScaler;
    }
    
    calculateScale() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate scale based on width
        let scale = viewportWidth / this.options.desktopWidth;
        
        // Ensure scale doesn't go below minimum
        if (scale < (this.options.minWidth / this.options.desktopWidth)) {
            scale = this.options.minWidth / this.options.desktopWidth;
        }
        
        // Ensure scale doesn't exceed maximum
        if (scale > (this.options.maxWidth / this.options.desktopWidth)) {
            scale = this.options.maxWidth / this.options.desktopWidth;
        }
        
        // Additional height check for landscape orientation
        if (viewportHeight < 500 && window.orientation === 90 || window.orientation === -90) {
            const heightScale = viewportHeight / (this.options.desktopWidth * 0.8);
            scale = Math.min(scale, heightScale);
        }
        
        this.scaleFactor = scale;
        
        // Update CSS variable
        document.documentElement.style.setProperty('--scale-factor', scale.toString());
        
        // Update font size if enabled
        if (this.options.enableFontScaling) {
            const baseFontSize = 16 * scale;
            document.documentElement.style.setProperty('--base-font-size', `${baseFontSize}px`);
        }
    }
    
    applyScaling() {
        if (!this.proportionalScaler) return;
        
        // Apply main scaling transform
        this.proportionalScaler.style.transform = `scale(${this.scaleFactor})`;
        this.proportionalScaler.style.width = `${this.options.desktopWidth}px`;
        
        // Adjust container height to prevent overflow
        const scaledHeight = this.proportionalScaler.scrollHeight * this.scaleFactor;
        this.scrollContainer.style.height = `${Math.max(scaledHeight, window.innerHeight)}px`;
        
        // Apply scaling to animations if enabled
        if (this.options.enableAnimationScaling) {
            this.scaleAnimations();
        }
        
        // Apply scaling to modals if enabled
        if (this.options.enableModalScaling) {
            this.scaleModals();
        }
        
        // Apply font scaling if enabled
        if (this.options.enableFontScaling) {
            this.scaleFonts();
        }
    }
    
    scaleAnimations() {
        // Scale all animation containers
        const animationContainers = document.querySelectorAll('.futuristic-header, .futuristic-welcome, .futuristic-product, .futuristic-modal, .futuristic-footer');
        
        animationContainers.forEach(container => {
            container.style.transform = `scale(${this.scaleFactor})`;
            container.style.transformOrigin = 'top left';
            
            // Scale particles within containers
            const particles = container.querySelectorAll('.particle');
            particles.forEach(particle => {
                const currentSize = parseInt(particle.style.width || '4');
                const newSize = currentSize * this.scaleFactor;
                particle.style.width = `${newSize}px`;
                particle.style.height = `${newSize}px`;
            });
        });
    }
    
    scaleModals() {
        // Scale all modal containers
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.style.transform = `scale(${this.scaleFactor})`;
            modal.style.transformOrigin = 'center';
            
            // Scale modal content
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                const baseWidth = 600;
                const scaledWidth = baseWidth * this.scaleFactor;
                modalContent.style.width = `${Math.min(scaledWidth, window.innerWidth * 0.9)}px`;
            }
        });
    }
    
    scaleFonts() {
        // Scale text elements
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, label');
        
        textElements.forEach(element => {
            // Skip elements with explicit font-size set
            if (element.style.fontSize && !element.style.fontSize.includes('rem')) {
                return;
            }
            
            // Get computed font size
            const computedStyle = window.getComputedStyle(element);
            const currentSize = parseFloat(computedStyle.fontSize);
            
            // Only scale if it's a reasonable size
            if (currentSize > 8 && currentSize < 100) {
                const newSize = currentSize * this.scaleFactor;
                element.style.fontSize = `${newSize}px`;
            }
        });
    }
    
    setupEventListeners() {
        // Handle window resize with debouncing
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 500);
        });
        
        // Handle device pixel ratio changes
        if (window.matchMedia) {
            const pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
            pixelRatioQuery.addListener(() => {
                this.handleResize();
            });
        }
        
        // Prevent zoom on double tap (iOS)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Ensure font size is large enough to prevent zoom
                const currentFontSize = parseFloat(window.getComputedStyle(input).fontSize);
                if (currentFontSize < 16) {
                    input.style.fontSize = '16px';
                }
            });
        });
        
        // Handle scroll position
        this.scrollContainer.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    handleResize() {
        if (!this.isInitialized) return;
        
        // Recalculate scale
        this.calculateScale();
        
        // Reapply scaling
        this.applyScaling();
        
        console.log(`🔄 Scale updated: ${this.scaleFactor.toFixed(3)}`);
    }
    
    handleScroll() {
        // Ensure content stays properly positioned during scroll
        const scrollTop = this.scrollContainer.scrollTop;
        const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
        
        // Prevent overscroll
        if (scrollTop < 0) {
            this.scrollContainer.scrollTop = 0;
        } else if (scrollTop > maxScroll) {
            this.scrollContainer.scrollTop = maxScroll;
        }
    }
    
    // Public API methods
    updateScale(newScale) {
        if (typeof newScale === 'number' && newScale > 0) {
            this.scaleFactor = Math.min(Math.max(newScale, 0.1), 3);
            document.documentElement.style.setProperty('--scale-factor', this.scaleFactor.toString());
            this.applyScaling();
        }
    }
    
    getScale() {
        return this.scaleFactor;
    }
    
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            scale: this.scaleFactor,
            effectiveWidth: window.innerWidth / this.scaleFactor,
            effectiveHeight: window.innerHeight / this.scaleFactor
        };
    }
    
    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        
        // Clear timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove scaling container and restore original content
        if (this.proportionalScaler && this.viewportManager) {
            const content = this.proportionalScaler.innerHTML;
            document.body.innerHTML = content;
            document.body.classList.remove('scaling-loaded', 'scaling-loading');
        }
        
        this.isInitialized = false;
    }
    
    // Utility methods
    refresh() {
        this.handleResize();
    }
    
    enableFontScaling(enable = true) {
        this.options.enableFontScaling = enable;
        if (enable) {
            this.scaleFonts();
        }
    }
    
    enableAnimationScaling(enable = true) {
        this.options.enableAnimationScaling = enable;
        if (enable) {
            this.scaleAnimations();
        }
    }
    
    enableModalScaling(enable = true) {
        this.options.enableModalScaling = enable;
        if (enable) {
            this.scaleModals();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if scaling should be enabled
    const enableScaling = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (enableScaling) {
        window.proportionalScaling = new ProportionalScalingSystem({
            desktopWidth: 1200,
            minWidth: 320,
            maxWidth: 1920,
            enableFontScaling: true,
            enableAnimationScaling: true,
            enableModalScaling: true
        });
    }
});

// Export for global access
window.ProportionalScalingSystem = ProportionalScalingSystem;
