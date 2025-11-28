/**
 * ENHANCED MOBILE DESKTOP SCALING SYSTEM
 * Advanced scaling with animation preservation and cross-browser compatibility
 */

class EnhancedMobileScaling {
    constructor() {
        // Desktop reference dimensions
        this.desktopWidth = 1920;
        this.desktopHeight = 1080;
        
        // Scaling state
        this.currentScale = 1;
        this.isMobile = false;
        this.isInitialized = false;
        
        // Performance tracking
        this.performanceMode = 'balanced';
        this.animationFrameId = null;
        
        // Browser detection
        this.browser = this.detectBrowser();
        this.device = this.detectDevice();
        
        // Initialize
        this.init();
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) return 'chrome';
        if (userAgent.includes('safari')) return 'safari';
        if (userAgent.includes('firefox')) return 'firefox';
        if (userAgent.includes('edge')) return 'edge';
        if (userAgent.includes('samsung')) return 'samsung';
        
        return 'unknown';
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('android')) return 'android';
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
        if (userAgent.includes('windows phone')) return 'windows';
        
        return 'unknown';
    }
    
    init() {
        // Detect mobile device
        this.detectMobile();
        
        // Setup viewport
        this.setupViewport();
        
        // Setup scaling container
        this.setupScalingContainer();
        
        // Apply initial scaling
        this.applyScaling();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup animation integration
        this.setupAnimationIntegration();
        
        // Start monitoring
        this.startMonitoring();
        
        // Mark as initialized
        this.isInitialized = true;
        
        console.log('🚀 Enhanced Mobile Desktop Scaling System Initialized');
        console.log(`📱 Device: ${this.device}`);
        console.log(`🌐 Browser: ${this.browser}`);
        console.log(`📐 Mobile: ${this.isMobile}`);
        console.log(`⚡ Performance: ${this.performanceMode}`);
    }
    
    detectMobile() {
        // Comprehensive mobile detection
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'windows phone', 'mobile', 'tablet', 'touch', 'webos'
        ];
        
        this.isMobile = mobileKeywords.some(keyword => 
            userAgent.includes(keyword)
        ) || window.innerWidth <= 1024;
        
        // Check touch capability
        this.isMobile = this.isMobile || ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0);
        
        // Check device memory and performance
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        
        if (memory >= 8 && cores >= 8) {
            this.performanceMode = 'high';
        } else if (memory >= 4 && cores >= 4) {
            this.performanceMode = 'balanced';
        } else {
            this.performanceMode = 'low';
        }
    }
    
    setupViewport() {
        // Override viewport for mobile devices
        if (this.isMobile) {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
                );
            }
            
            // Prevent zoom gestures
            this.preventZoom();
        }
    }
    
    preventZoom() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pinch zoom
        const preventGesture = (e) => e.preventDefault();
        document.addEventListener('gesturestart', preventGesture);
        document.addEventListener('gesturechange', preventGesture);
        document.addEventListener('gestureend', preventGesture);
        
        // Prevent Ctrl+zoom
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupScalingContainer() {
        // Create desktop container if it doesn't exist
        let desktopContainer = document.querySelector('.desktop-container');
        
        if (!desktopContainer) {
            desktopContainer = document.createElement('div');
            desktopContainer.className = 'desktop-container';
            
            // Move all body content to desktop container
            while (document.body.firstChild) {
                const node = document.body.firstChild;
                if (node.nodeType === Node.ELEMENT_NODE) {
                    desktopContainer.appendChild(node);
                } else {
                    document.body.removeChild(node);
                }
            }
            
            document.body.appendChild(desktopContainer);
        }
        
        this.desktopContainer = desktopContainer;
        
        // Setup container styles
        this.setupContainerStyles();
    }
    
    setupContainerStyles() {
        // Base styles for body
        Object.assign(document.body.style, {
            margin: '0',
            padding: '0',
            overflow: 'hidden',
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: '0',
            left: '0',
            backgroundColor: '#000'
        });
        
        // Container styles
        Object.assign(this.desktopContainer.style, {
            width: `${this.desktopWidth}px`,
            height: `${this.desktopHeight}px`,
            position: 'absolute',
            top: '0',
            left: '0',
            transformOrigin: 'top left',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-dark, #000)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
        });
        
        // Browser-specific optimizations
        this.applyBrowserOptimizations();
    }
    
    applyBrowserOptimizations() {
        switch (this.browser) {
            case 'chrome':
                this.desktopContainer.style.transform = 'translateZ(0)';
                break;
            case 'safari':
                this.desktopContainer.style.webkitTransform = 'translateZ(0)';
                break;
            case 'firefox':
                this.desktopContainer.style.transform = 'translate3d(0,0,0)';
                break;
        }
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
        return Math.max(finalScale, 0.25);
    }
    
    applyScaling() {
        if (!this.isMobile) {
            this.resetScaling();
            return;
        }
        
        // Calculate new scale
        const newScale = this.calculateScale();
        
        // Apply scaling with performance optimization
        this.applyScaledTransform(newScale);
        
        // Update current scale
        this.currentScale = newScale;
        
        // Scale all dynamic elements
        this.scaleDynamicElements();
        
        // Update animations
        this.updateAnimations();
        
        // Center if needed
        this.centerScaledContent();
        
        console.log(`📐 Applied scaling: ${newScale.toFixed(3)}x`);
    }
    
    applyScaledTransform(scale) {
        // Use requestAnimationFrame for smooth scaling
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            this.desktopContainer.style.transform = `scale(${scale})`;
            
            // Browser-specific transform application
            switch (this.browser) {
                case 'safari':
                    this.desktopContainer.style.webkitTransform = `scale(${scale})`;
                    break;
                case 'firefox':
                    this.desktopContainer.style.transform = `scale3d(${scale}, ${scale}, 1)`;
                    break;
            }
        });
    }
    
    centerScaledContent() {
        const scaledWidth = this.desktopWidth * this.currentScale;
        const scaledHeight = this.desktopHeight * this.currentScale;
        
        // Calculate offsets for centering
        const offsetX = Math.max(0, (window.innerWidth - scaledWidth) / 2);
        const offsetY = Math.max(0, (window.innerHeight - scaledHeight) / 2);
        
        // Apply centering
        this.desktopContainer.style.left = `${offsetX}px`;
        this.desktopContainer.style.top = `${offsetY}px`;
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
        // Scale canvas elements
        this.scaleCanvasElements();
        
        // Scale SVG elements
        this.scaleSVGElements();
        
        // Scale images
        this.scaleImages();
        
        // Scale text
        this.scaleText();
        
        // Scale animations
        this.scaleAnimationElements();
        
        // Scale modals and overlays
        this.scaleModals();
    }
    
    scaleCanvasElements() {
        const canvases = this.desktopContainer.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (!canvas.dataset.originalWidth) {
                canvas.dataset.originalWidth = canvas.width;
                canvas.dataset.originalHeight = canvas.height;
            }
            
            const originalWidth = parseFloat(canvas.dataset.originalWidth);
            const originalHeight = parseFloat(canvas.dataset.originalHeight);
            
            canvas.style.width = `${originalWidth * this.currentScale}px`;
            canvas.style.height = `${originalHeight * this.currentScale}px`;
            
            // Update canvas resolution for crisp rendering
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const devicePixelRatio = window.devicePixelRatio || 1;
                canvas.width = originalWidth * devicePixelRatio;
                canvas.height = originalHeight * devicePixelRatio;
                ctx.scale(devicePixelRatio, devicePixelRatio);
            }
        });
    }
    
    scaleSVGElements() {
        const svgs = this.desktopContainer.querySelectorAll('svg');
        svgs.forEach(svg => {
            if (!svg.dataset.originalWidth) {
                const viewBox = svg.getAttribute('viewBox');
                if (viewBox) {
                    const values = viewBox.split(' ');
                    svg.dataset.originalWidth = parseFloat(values[2]) || svg.getAttribute('width');
                    svg.dataset.originalHeight = parseFloat(values[3]) || svg.getAttribute('height');
                } else {
                    svg.dataset.originalWidth = svg.getAttribute('width') || 100;
                    svg.dataset.originalHeight = svg.getAttribute('height') || 100;
                }
            }
            
            const originalWidth = parseFloat(svg.dataset.originalWidth);
            const originalHeight = parseFloat(svg.dataset.originalHeight);
            
            svg.style.width = `${originalWidth * this.currentScale}px`;
            svg.style.height = `${originalHeight * this.currentScale}px`;
        });
    }
    
    scaleImages() {
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
            img.style.maxWidth = 'none';
        });
    }
    
    scaleText() {
        const textElements = this.desktopContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, input, textarea');
        textElements.forEach(element => {
            if (!element.dataset.originalFontSize) {
                const computedStyle = window.getComputedStyle(element);
                element.dataset.originalFontSize = parseFloat(computedStyle.fontSize);
            }
            
            const originalFontSize = parseFloat(element.dataset.originalFontSize);
            const newFontSize = originalFontSize * this.currentScale;
            
            // Apply minimum font size for readability
            const minFontSize = 10;
            const finalFontSize = Math.max(newFontSize, minFontSize);
            
            element.style.fontSize = `${finalFontSize}px`;
        });
    }
    
    scaleAnimationElements() {
        // Scale particle systems
        this.scaleParticles();
        
        // Scale geometric patterns
        this.scaleGeometricElements();
        
        // Scale wave animations
        this.scaleWaveAnimations();
    }
    
    scaleParticles() {
        const particleContainers = this.desktopContainer.querySelectorAll('.futuristic-particles, .particles');
        particleContainers.forEach(container => {
            const particles = container.querySelectorAll('.particle, .particle-element');
            particles.forEach(particle => {
                if (!particle.dataset.originalSize) {
                    const computedStyle = window.getComputedStyle(particle);
                    particle.dataset.originalSize = parseFloat(computedStyle.width) || 4;
                }
                
                const originalSize = parseFloat(particle.dataset.originalSize);
                const newSize = Math.max(originalSize * this.currentScale, 1);
                
                particle.style.width = `${newSize}px`;
                particle.style.height = `${newSize}px`;
            });
        });
    }
    
    scaleGeometricElements() {
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
    
    scaleWaveAnimations() {
        const waveElements = this.desktopContainer.querySelectorAll('.futuristic-waves .wave, .wave-animation');
        waveElements.forEach(wave => {
            if (!wave.dataset.originalHeight) {
                const computedStyle = window.getComputedStyle(wave);
                wave.dataset.originalHeight = parseFloat(computedStyle.height) || 2;
            }
            
            const originalHeight = parseFloat(wave.dataset.originalHeight);
            const newHeight = Math.max(originalHeight * this.currentScale, 1);
            
            wave.style.height = `${newHeight}px`;
        });
    }
    
    scaleModals() {
        const modals = this.desktopContainer.querySelectorAll('.modal, .modal-content, .popup, .overlay');
        modals.forEach(modal => {
            if (!modal.dataset.originalWidth) {
                const computedStyle = window.getComputedStyle(modal);
                modal.dataset.originalWidth = parseFloat(computedStyle.width) || 800;
                modal.dataset.originalHeight = parseFloat(computedStyle.height) || 600;
            }
            
            const originalWidth = parseFloat(modal.dataset.originalWidth);
            const originalHeight = parseFloat(modal.dataset.originalHeight);
            
            modal.style.width = `${originalWidth * this.currentScale}px`;
            modal.style.height = `${originalHeight * this.currentScale}px`;
        });
    }
    
    updateAnimations() {
        // Update CSS animation durations
        this.updateCSSAnimations();
        
        // Update CSS transitions
        this.updateCSSTransitions();
        
        // Update JavaScript animations
        this.updateJSAnimations();
    }
    
    updateCSSAnimations() {
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
    }
    
    updateCSSTransitions() {
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
    
    updateJSAnimations() {
        // Update animation frame based animations
        if (window.futuristicAnimationSystem) {
            window.futuristicAnimationSystem.updateScale(this.currentScale);
        }
        
        // Emit custom event for other animation systems
        const event = new CustomEvent('scaleUpdate', {
            detail: { scale: this.currentScale }
        });
        document.dispatchEvent(event);
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
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleResize();
            }
        });
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.applyScaling();
        }, 100);
    }
    
    setupAnimationIntegration() {
        // Listen for animation system events
        document.addEventListener('animationUpdate', () => {
            this.scaleDynamicElements();
        });
        
        document.addEventListener('animationComplete', () => {
            this.updateAnimations();
        });
        
        // Setup periodic updates for dynamic content
        setInterval(() => {
            if (this.isMobile && this.isInitialized) {
                this.scaleDynamicElements();
            }
        }, 5000);
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
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
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
    
    getPerformanceMode() {
        return this.performanceMode;
    }
    
    setPerformanceMode(mode) {
        this.performanceMode = mode;
        this.applyScaling();
    }
    
    destroy() {
        // Cleanup
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        clearTimeout(this.resizeTimeout);
        
        // Reset scaling
        this.resetScaling();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        window.removeEventListener('devicepixelratio', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleResize);
        
        this.isInitialized = false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced mobile desktop scaling
    window.enhancedMobileScaling = new EnhancedMobileScaling();
    
    // Make it globally available
    window.updateMobileScaling = () => {
        if (window.enhancedMobileScaling) {
            window.enhancedMobileScaling.updateScale();
        }
    };
    
    window.getMobileScale = () => {
        return window.enhancedMobileScaling ? window.enhancedMobileScaling.getCurrentScale() : 1;
    };
    
    console.log('🎯 Enhanced Mobile Scaling System Ready');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedMobileScaling;
}
